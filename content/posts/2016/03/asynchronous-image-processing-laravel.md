---
title: Optimised image handling with AWS and Laravel
slug: optimised-image-handling-aws-laravel
date: 2016-03-19
tech:
 - AWS
 - Beanstalkd
 - Dependency injection
 - EC2
 - Imagick
 - Laravel
 - nginx
 - PHP
 - S3
 - SQS
---

A central feature in my side project [Pop Robin Cards](https://github.com/hughgrigg
/poprobincards) is the management of product images. In the first iteration, images
uploaded by the user were simply stored locally on disk and served by nginx.
This approach works fine, but has some problems:

 - It uses disk space on the EC2 instance hosting the site, where disk space is
   at a premium.
 - It makes it harder to load balance between multiple application server
   instances.
 - It uses application server resources to serve images.
 - If the EC2 instance storing the images goes down then the images may be lost.
 - There are potential security issues around storing user-uploaded files on
   the application server.

S3 provides an ideal solution to those issues. It's cheap, durable, fast and
centralised. With that in mind, I implemented a simple image processing system
to optimise uploaded images and transfer them to S3.

## 1: Set up in Laravel

Laravel comes with pretty much all the functionality needed for this out of the
box. The first change was allowing the image repository class to dispatch
events, which would be picked up by an asynchronous listener for processing.

One [controversial aspect](http://taylorotwell.com/response-dont-use-facades/)
of Laravel's design is the heavy use of statically-accessed "facades" to perform
common tasks in the framework. Usually static access is frowned upon because it
makes things harder to test, but Laravel's implementation does actually
facilitate testing with facades. Despite that, I still find them a bit magical
and unnecessarily obfuscated, and so I try to avoid them.

Happily, Laravel's dependency injection container also makes it easy to inject
whatever you want into an object, and there's a [handy
list](https://laravel.com/docs/5.2/facades#facade-class-reference) of the
classes behind the facades.

So the first change was to get an event dispatcher injected into the image
repository:

{{< highlight php >}}
<?php

/**
 * ImageRepository constructor.
 *
 * @param Image      $imageResource
 * @param Config     $config
 * @param Dispatcher $dispatcher
 */
public function __construct(
    Image $imageResource,
    Config $config,
    Dispatcher $dispatcher
) {
    $this->imageResource = $imageResource;
    $this->config = $config;
    $this->dispatcher = $dispatcher;
}
{{< /highlight >}}

And then in the image storage method, we can dispatch the event:

{{< highlight php >}}
<?php

/**
 * @param UploadedFile $upload
 *
 * @return Image
 */
public function storeUploadedImage(UploadedFile $upload): Image
{
    $newImage = $this->imageResource->create(
        [
        'filename' => uniqid().$upload->getClientOriginalName(),
        ]
    );
    $upload->move(storage_path('image'), $newImage->filename());

    $this->dispatcher->fire(new NewImageEvent($newImage));

    return $newImage;
}
{{< /highlight >}}

In the event service provider, a listener is registered for that event.
Importantly, the listener implements Laravel's [ShouldQueue](https://laravel.com
/api/5.1/Illuminate/Contracts/Queue/ShouldQueue.html) interface, so the
framework will queue this event and pass it to the listener asynchronously. This
way the user gets a good response time without waiting for the image to be
processed and uploaded to S3. The queuing is handled by Beanstalkd in the
development environment, and by SQS in production.

## 2: Optimising images

The first job of the new image listener is to optimise the new image. There's an
`ImagePreProcessor` class with a collection of optimisers to do that, using
_Imagick_ to make the changes to the image. The optimisers do things like strip
meta-data, convert JPEGs to progressive, set the compression level and so on.

One of the optimisers also generates a set of differently sized images, which
allows adding a `srcset` attribute in the markup for each image. Browsers can
then download the most appropriately sized version.

Again, Laravel makes it easy to get that injected along with the other
dependencies:

{{< highlight php >}}
<?php

/**
 * @param ImagePreProcessor $imagePreProcessor
 * @param Filesystem        $publicFilesystem
 * @param Config            $config
 */
public function __construct(
    ImagePreProcessor $imagePreProcessor,
    Filesystem $publicFilesystem,
    Config $config
) {
    $this->imagePreProcessor = $imagePreProcessor;
    $this->publicFilesystem = $publicFilesystem;
    $this->config = $config;
}
{{< /highlight >}}

## 3: Transferring to S3

Finally, the new image listener needs to transfer the optimised image to an S3
bucket, allowing it to be served quickly and cheaply. This can be done with
Laravel's Filesystem implementation, using an S3 bucket in production and the
local disk in the development environment.

The resulting handler method looks like this:

{{< highlight php >}}
<?php

/**
 * @param NewImageEvent $event
 */
public function handle(NewImageEvent $event)
{
    if (!$this->storageImageFile($event->image())->isFile()) {
        $event->image()->setAttribute('filename', '');
        $event->image()->save();

        return;
    }

    $this->imagePreProcessor->preProcess($event->image());
    $this->transferImageFiles($event);
    $this->deleteLocalImageFile($event);
    $this->updateImageResource($event);
}
{{< /highlight >}}

Due to the simple dependency injection, this implementation is easy to test and
maintain.
