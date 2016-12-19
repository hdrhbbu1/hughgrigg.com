---
title: Simple pipes with PHP generators
slug: simple-pipes-php-generators
date: 2016-11-23
author: Hugh Grigg
tech:
 - bash
 - gulpjs
 - PHP
 - PHP7
 - Unix
---

Pipes are a great structural pattern that can simplify the design of all kinds
of software. They're a central part of the Unix philosophy, allowing users to
chain together a series of simple parts to achieve a more complex goal.
Similarly, gulpjs brings the benefit of a pipe-based design to asset generation
in the nodejs ecosystem.

I haven't seen pipes used so much in the PHP world, but they've been simple to
set up since
[generators](https://secure.php.net/manual/en/language.generators.overview.php)
were added to the language in 5.4.

Recently at work we had a programming task that was a great candidate for being
broken down into discrete parts and piped together. We had a series of items
coming from a database cursor that needed to be filtered, adjusted and have
information from other data sources added to them.

These operations would be easy to achieve with collections (e.g. [Illuminate
collections](https://laravel.com/docs/master/collections)), and that would be
fine for a lot of use cases. The piped approach is most useful when the total
size of the set being operated on is large, as pipes can keep peak memory usage
to a minimum. Pipes are also useful when working with a stream of data without
a specified end point.

## PHP pipes

A basic PHP pipeline can look like this:

```php
<?php

(new Pipeline([1, 2, 3]))
    ->pipe(
        function (int $number): int {
            return $number + 1;
        }
    )
    ->pipe(
        function (int $number): int {
            return $number * 10;
        }
    )
    ->pipe(
        function (int $number): int {
            return $number / 2;
        }
    )
    ->tap();
```

The `tap()` method on the pipeline returns a generator that we can then iterate
on ourselves. Printing the output from that gives the result of taking each
item, adding one, multiplying by ten and then dividing by two: `10 15 20`.

The pipeline is provided by this simple class:

```php
<?php

/**
 * Pipe-able workflow.
 */
class Pipeline
{
    /** @var array|Generator */
    private $flow;

    /**
     * @param array|Generator $flow
     */
    public function __construct($flow)
    {
        $this->flow = $flow;
    }

    /**
     * @param callable $work
     * 
     * @return Pipeline
     */
    public function pipe(callable $work): Pipeline
    {
        $next = function () use ($work) {
            foreach ($this->flow as $item) {
                yield $work($item);
            }
        };

        return new self($next());
    }

    /**
     * @return Generator
     */
    public function tap(): Generator
    {
        foreach ($this->flow as $item) {
            yield $item;
        }
    }
}
```

All it does is take something iterable as input, and then allow units of work to
be set up in a sequence with the `pipe()` method. Inside that method, an
anonymous function is created that will provide a generator to the next stage in
the pipeline. In this way, each stage of the pipeline is immutable and contains
only a generator.

Note that no work is done until something external to the pipeline actually
iterates on it. The pipeline is just a container for work waiting to be done.
This fits quite well with the image of a pipe full of water: nothing will flow
down it until the tap is opened at the other end.

To keep things simple, the class allows passing in either an array or a
generator for the input. Unfortunately, PHP's generators are slightly lacking in
that they are not interchangeable with the language's array type. The
dynamically typed constructor agument for this pipeline class is a way to get
around that.

In our use case we were passing a database cursor object into the pipeline,
which is a generator.

## Iterable pipelines

Another thing that might improve the pipeline class is to allow it to be
iterated on itself by other code. That can be achieved by implementing the
[Iterator](https://secure.php.net/manual/en/class.iterator.php) interface, which
just requires forwarding the iterator method calls to the generator the pipeline
is wrapping.

That way we don't need the `tap()` method, and can just iterate on the
pipeline itself:

```php
<?php

$pipeline = (new Pipeline(['c', 'v', 'c', 'r']))
    ->pipe('str_rot13')
    ->pipe('mb_strtoupper');

foreach ($pipeline as $item) {
    print $item;
}
```

Which gives us the output `PIPE`. Notice how you can pass in string function
names if you prefer that, as PHP allows this in the `callable` type. This just
makes things more compact.

## Type-safe pipelines

If the use case was getting more complex, it could be good to make the pipeline
type-safe. That can be done by making an interface for the work functions using
PHP's `__invoke()` method. This is handy whenever you want type-hintable
functions.

```php
<?php

/**
 * Do work on an integer.
 */
interface IntegerWork
{
    /**
     * @param int $number
     *
     * @return int
     */
    public function __invoke(int $number): int;
}
```

Then we can have a pipeline that only works on integers by using that interface
as the type-hint for the `pipe()` method:

```php
<?php

// ...

    public function pipe(IntegerWork $work): Pipeline {
        // ...
    }

```

Most likely you would be type-hinting a specific interface in your application
instead of a scalar, but this demonstrates the idea.

Alternatively, you might want the option of transforming items as they pass down
the pipeline. For example, the pipeline might take numbers, format them into
currency strings, wrap those in some object, apply decorators, etc. How to
design the interfaces, if at all, would depend on what is worthwhile to catch
errors without introducing unnecessary complexity.

## Piping generators

So far, the pipeline class is only able to give a single item to each worker and
pass on a single item from it down the pipeline. This is clear and keeps thing
readable, but in some situations you might want the workers to be able to do
more interesting things such as accumulate items into batches before releasing
them.

There are a few different ways this could be achieved, but the most direct is
probably to have the workers take and return generators themselves. This allows
a maximum of flexibility, and the only change required is to the `pipe()`
method:

```php
<?php

// ...

    public function pipe(callable $work): Pipeline {
        $next = function () use ($work) {
            foreach ($work($this->flow) as $item) {
                yield $item;
            }
        };

        return new self($next());
    }

```

Then the workers can control how items flow down the pipeline, e.g.:

```php
<?php

$in = function () {
    foreach (['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as $item) {
        yield $item;
    }
};

$pipeline = (new Pipeline($in()))
    ->pipe(
        function (Generator $flow): Generator {
            $batch = [];
            foreach ($flow as $item) {
                $batch[] = $item;
                if (count($batch) === 3) {
                    yield $batch;
                    $batch = [];
                }
            }
            yield $batch;
        }
    )
    ->pipe(
        function (Generator $flow): Generator {
            foreach ($flow as $item) {
                yield mb_strtoupper(implode('-', $item));
            }
        }
    );
```

As you can see, this is already less clear than the simple workers above, but it
can be useful in some situations. What's happening in the example is that the
first worker is grouping up the items into batches of three, and the second
worker is joining those together into a formatted string: `A-B-C` `D-E-F` `G-H`.

If we didn't want the final incomplete batch, we could just drop the final
`yield` in the first worker function. Again, a real usecase would be doing
something more interesting on some meaningful data.

To improve the readability of this, I would probably move the accumulation logic
into the pipeline itself rather than letting the workers do it. That could look
like this:

```php
<?php

    // ...

    /**
     * @param int $size
     *
     * @return Pipeline
     */
    public function accumulate(int $size): Pipeline
    {
        $next = function () use ($size) {
            $batch = [];
            foreach ($this->flow as $item) {
                $batch[] = $item;
                if (count($batch) === $size) {
                    yield $batch;
                    $batch = [];
                }
            }
            yield $batch;
        };

        return new self($next());
    }
```

Then the original `pipe()` method can be used and the pipeline is more readable:

```php
<?php

$pipeline = (new Pipeline($in()))
    ->accumulate(3)
    ->pipe(
        function (array $item): string {
            return mb_strtoupper(implode('-', $item));
        }
    );
```

That could be complemented with a `split()` method that unwraps the batches as
they come through. In either case, we're keeping peak memory usage to a minimum
as once an item or batch has gone through the pipeline it can be garbage
collected.

One other thing we can do is have the worker functions accumulate a batch for
their own purposes whilst also yielding individual items down the pipeline as
usual. We could do that by allowing the `accumulate()` method to also receive a
worker function for the batches.

As you can see, there are endless possibilities with a pipeline design -- the
flow can be duplicated, re-routed, filtered, merged and so on, all while keeping
things readable and minimising peak memory usage.

This post is just a demo of how straightforward it can be to get a pipeline
working in PHP with a few lines of code. For a fuller implementation of the
pipeline pattern in PHP, you might be interested in the
[League\Pipeline](http://pipeline.thephpleague.com/) composer package.
