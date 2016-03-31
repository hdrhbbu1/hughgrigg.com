---
title: Optimised image handling with AWS and Laravel
slug: optimised-image-handling-aws-laravel
date: 2016-03-19
draft: true
tech:
 - AWS
 - Beanstalkd
 - EC2
 - Imagick
 - Laravel
 - nginx
 - PHP
 - S3
 - SQS
---

A central feature in my side project [Ching Shop](https://github.com/hughgrigg
/ching-shop) is the management of product images. In the first iteration, images
uploaded by the user were simply stored locally on disk and served by nginx.
This approach works fine, but has some problems:

 - It uses disk space on the EC2 instance hosting the site, where disk space is
   at a premium.
 - It makes it harder to load balance between multiple application server
   instances.
 - It uses application server resources to serve images.
 - If the EC2 instance storing the images does down then the images may be lost.
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
    $newImage = $this->imageResource->create([
        'filename' => uniqid().$upload->getClientOriginalName(),
    ]);
    $upload->move($newImage->directory(), $newImage->filename());

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

The listener handles the new image event like this:

{{< highlight php >}}
<?php
// TODO
{{< /highlight >}}

## 2: Optimising images

## 3: Transferring to S3
