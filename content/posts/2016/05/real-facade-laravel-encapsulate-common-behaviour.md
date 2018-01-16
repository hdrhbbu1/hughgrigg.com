---
title: Using a real facade pattern in Laravel to encapsulate common behaviour
slug: real-facade-laravel-encapsulate-common-behaviour
date: 2016-05-05
author: Hugh Grigg
tech:
 - Dependency injection
 - Design patterns
 - Facade
 - Laravel
 - OOP
 - PHP
 - PHP-MD
 - PHP7
 - Static analysis
---

Whilst working on my side project [Pop Robin Cards](https://www.poprobincards.co.uk/)
([source](https://github.com/hughgrigg/poprobincards)), one of the PHP-MD rules I
have configured flagged an issue:

```
poprobincards/app/Http/Controllers/Staff/ProductController.php:53
The method __construct has 6 parameters. Consider to reduce parameter number
under 5.
```

PHP-MD is quite rightly pointing out that six parameters for a method is
excessive, even for a constructor. But what can be done? The six parameters are
all things that the `ProductController` needs to do its job:

```php
<?php

/**
 * ProductController constructor.
 *
 * @param ProductRepository $productRepository
 * @param ViewFactory       $viewFactory
 * @param ResponseFactory   $responseFactory
 * @param ImageRepository   $imageRepository
 * @param TagRepository     $tagRepository
 * @param FlashNotifier     $flashNotifier
 */
public function __construct(
    ProductRepository $productRepository,
    ViewFactory $viewFactory,
    ResponseFactory $responseFactory,
    ImageRepository $imageRepository,
    TagRepository $tagRepository,
    FlashNotifier $flashNotifier
) {
    $this->productRepository = $productRepository;
    $this->viewFactory = $viewFactory;
    $this->responseFactory = $responseFactory;
    $this->imageRepository = $imageRepository;
    $this->tagRepository = $tagRepository;
    $this->flashNotifier = $flashNotifier;
}
```

One option is to break out a separate controller that can take responsibility
for some of the tasks `ProductController` is currently doing. However, this
could be an arbitrary split that would need a decision every time there a
changes related to these requests.

The option I went with instead involves using a real [facade
pattern](https://en.wikipedia.org/wiki/Facade_pattern). Note that this is
different to [what Laravel calls a
facade](https://laravel.com/docs/5.2/facades). The facade I'm using wraps up
access to the methods I need on the `ViewFactory`, `ResponseFactory` and
`FlashNotifier`. It makes sense to encapsulate these together because they're
commonly used across several controller classes, and all involve producing
responses to HTTP requests.

Inevitably I had a bit of [trouble thinking of a
name](http://martinfowler.com/bliki/TwoHardThings.html) for this facade;
eventually I settled on `WebUi`. As with any name, it's not perfect, but I think
it indicates well enough that the class encapsulates the user-oriented aspect of
responding to web requests.

The `WebUi` class is a wrapper for the methods my controllers use from those
three classes:

```php
<?php

namespace ChingShop\Http;

use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Contracts\View\Factory as ViewFactory;
use Laracasts\Flash\FlashNotifier;

/**
 * Class WebUi
 *
 * @package ChingShop\Http
 *
 * Adapter for commonly used web user interface components.
 */
class WebUi
{
    /** @var ViewFactory */
    private $viewFactory;

    /** @var ResponseFactory */
    private $responseFactory;

    /** @var FlashNotifier */
    private $flashNotifier;

    /**
     * WebUi constructor.
     *
     * @param ViewFactory     $viewFactory
     * @param ResponseFactory $responseFactory
     * @param FlashNotifier   $flashNotifier
     */
    public function __construct(
        ViewFactory $viewFactory,
        ResponseFactory $responseFactory,
        FlashNotifier $flashNotifier
    ) {
        $this->viewFactory = $viewFactory;
        $this->responseFactory = $responseFactory;
        $this->flashNotifier = $flashNotifier;
    }

    /**
     * @param string $view
     * @param array  $data
     * @param array  $mergeData
     *
     * @return \Illuminate\Contracts\View\View
     */
    public function view(string $view, array $data = [], array $mergeData = [])
    {
        return $this->viewFactory->make($view, $data, $mergeData);
    }

    /**
     * @param string $route
     * @param array  $parameters
     * @param int    $status
     * @param array  $headers
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function redirect(
        string $route,
        array $parameters = [],
        int $status = 302,
        array $headers = []
    ) {
        return $this->responseFactory->redirectToRoute(
            $route,
            $parameters,
            $status,
            $headers
        );
    }

    // ... and so on
}

```

Wrapping the underlying classes from the framework also gave the opportunity to
use PHP 7's scalar type hinting, which is nice to have.

Laravel's dependency injection makes this refactoring straightforward, as no
effort is required to get the factories injected into the `WebUi`, nor to get
the `WebUi` injected into the `ProductController`; Laravel's container can
determine the dependencies on its own and inject them. Now the
`ProductController` constructor looks like this:

```php
<?php

/**
 * ProductController constructor.
 *
 * @param ProductRepository $productRepository
 * @param ImageRepository   $imageRepository
 * @param TagRepository     $tagRepository
 * @param WebUi             $webUi
 */
public function __construct(
    ProductRepository $productRepository,
    ImageRepository $imageRepository,
    TagRepository $tagRepository,
    WebUi $webUi
) {
    $this->productRepository = $productRepository;
    $this->imageRepository = $imageRepository;
    $this->tagRepository = $tagRepository;
    $this->webUi = $webUi;
}
```

I think this better expresses what the controller is doing: co-ordinating users'
web requests about products, images and tags. Four parameters is still quite a
lot, but it would be easy to re-apply this refactoring once more, perhaps
resulting in a `CatalogueRepository` wrapper that encapsulates common operations
between the three existing repository classes.

As well as being easy to inject due to the dependency injection container, this
new structure is also easier to test. The `ProductController` has fewer
dependencies, and the `WebUi` is itself straightforward to write unit tests for.
Finally, having the `WebUi` class available offers opportunity for code re-use
with every other controller by following the rule of [composition over
inheritance](http://c2.com/cgi/wiki?CompositionInsteadOfInheritance).
