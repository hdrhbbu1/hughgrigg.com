---
title: PHP's list() is asking for a class
slug: php-list-asking-for-class
date: 2016-04-17
---

PHP has a weird mechanism for achieving multiple return values with the `list`
function. It lets you do things like this:

```php
function severalThings() {
	return ['thing', 'another thing', 'one more thing'];
}

list($foo, $bar, $foobar) = severalThings();
```

This is quite commonly used in some codebases, but I think it's bad style.

Firstly, because PHP doesn't offer a concrete way to let the user of a function
know exactly what it's returning, it may not be clear exactly what you're
getting from that array. The function could even not return an array at all, in
which case trying to use `list` on its return value will silently set your
variables to null.

At least in PHP 7 we can now guarantee that the function will return an array,
but we still can't be sure what the array contains or how many values it has.
The user of the function always needs to go and look at exactly what the
function is doing to be sure. Bad luck if it's some 1000 line monstrosity with
ten levels of indentation.

When you're sure you know what the function is giving you, you may not want all
of the values in the array it's returning. In that case, your options are:

 - Leave unused variables in the local scope, which your static analyser will
   rightly complain about.
 - Refer to particular values by their index (e.g. `$bar = severalThings()[1]`),
   which is unclear and will also prevent analysers from picking up various
   problems they otherwise would have known about.
 - Do something like `list($foo,,$bar) = severalThings()`. Also fairly horrible.

This doesn't just cause problems for users of the function. Once you've got
client code using `list` on the return values of a function, it's difficult to
ever change the number or ordering of elements. As mentioned above, code
analysis tools have no idea what's going on with `list`, so automated
refactorings are out.

There is one clear solution to all of this: don't return an array, return an
instance of a class. Anywhere `list` is used is begging for a class.

When `list` is used, we've got a situation where we need x, y and z values. A
class or interface is the perfect way to achieve that in a safe, clear and
maintainable way. In PHP 5, a doc block can indicate what interface the function
is going to return, and in PHP 7 we can guarantee it with a return type.

Returning an instance of a class or interface also makes the code easier to
change in future. You don't need to add bloat to the function if more logic is
required, as it can now be encapsulated in the class, which has all the
advantages you'd expect when dealing with an object:

 - It's easy to add more functionality to the return value in an understandable
   way.
 - Existing clients don't need to change if the returned object has a new method
   on it.
 - Test code can be more expressive and better document the functionality.
 - Static analysers understand the code and can help you find problems while
   you're still writing it.
 - In PHP 7 you can use anonymous classes that implement the expected return
   interface, making this even more flexible.

In short, classes are better than `list()`.
