---
title: Scalar type declarations in PHP 7
slug: scalar-type-declarations-php7
date: 2016-09-30
author: Hugh Grigg
tech:
 - PHP
 - PHP7
 - phpDoc
topics:
 - types
---

One of my favourite new features in PHP 7 is [scalar type
declarations](http://php.net/manual/en/migration70.new-
features.php#migration70.new-features.scalar-type-declarations).

Prior to PHP 7, the language's type declaration abilities were somewhat
inconsistent. You could type hint classes, interfaces and arrays, but nothing
else (including _callable_ and _self_ in those). To require types for any scalar
values (strings, ints, bools and floats), you had to do your own type checking
and coercion.

However, it is worth pointing out that it was and is possible to do deeper type
checking in PHP using value objects or interfaces. This is a nice technique and
has some added benefits over plain scalar type declarations. For example,
declaring _Weight_, _Distance_ and _Length_ interfaces is more rigorous than
just declaring int or float types for those values.

In any case, PHP 7 now lets you declare scalar types cleanly and easily. It
looks like this:

```php
<?php

function fooBar(int $foo, string $bar) {
	// do something with an int and a string.
}
```

By default, scalar type declarations are coercive. This lets them handle what a
lot of people were doing manually at the top of their PHP functions: casting
scalar arguments into the expected type.

If the coercion is not possible (e.g. you pass "hello" for a parameter declared
as _int_), then you get a _TypeError_. You can also enable strict type checking,
in which case no coercion will be done and you always get the error on
mismatched types.

Having this at the language level is nice as it makes it clear at a glance what
the expected type is, as well as allowing IDEs and static analysers to get
better insight into what's going on.

Again, this was previously possible with [phpDoc type
hints](https://phpdoc.org/docs/latest/references/phpdoc/tags/param.html), but
it's good to have the interpreter enforce and coerce it as this gives a stronger
guarantee.

## What's the point without a compiler?

As far as I know, PHP has become slightly unusual among interpreted dynamic
languages by offering this kind of type declaration. Normally a large benefit of
such a type system comes from getting compilation errors; the code simply cannot
be compiled, let alone run, if there are type errors.

This won't be the case with an interpreted language like PHP: a program with
type errors can be executed and even run in production, for example, if the
errors go unnoticed.

Despite that, PHP's somewhat hybrid approach to this still has some benefits.
Dynamic and strong languages tend to result in different development workflows:
dynamic languages are flexible and supposedly faster to work with, but they need
to be [backed up with thorough
tests](http://c2.com/cgi/wiki?DesignByContractAssertionsVsUnitTestsVsTypes) to
catch errors. Strong languages can do a lot of this work for you by analysing
types during compilation.

PHP is now trying to allow a mix of both of these. You can dispense with type
declarations altogether and rely entirely on your tests, or you can make use of
type declarations and let the interpreter pick up some of that work. You
definitely still need a comprehensive suite of tests to exercise the code, but
some of the grunt work in catching basic type flow bugs has now been taken care
of.

What I'd love to see next in the language is [generic
array](https://wiki.php.net/rfc/generic-arrays) and iterable type declarations,
to allow enforcement of an array of strings or an interface, for example.
Currently, the only option is to declare _array_ and then do your own type
checking in the method as in PHP 5. From there we might even get [full
generics](https://wiki.php.net/rfc/generics) in PHP, which would be great.
