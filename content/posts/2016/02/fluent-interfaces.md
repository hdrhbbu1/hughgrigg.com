---
title: Fluent interfaces
date: 2016-02-05
slug: fluent-interfaces
draft: true
tech:
 - PHP
 - testing
 - OOP
---

One of many things that PHP has in common with the world of Java is the idea of
"fluent interfaces". These are classes that return the current instance for a
lot of their methods, allowing you to chain methods together.

They allow you to write code like:

```php
$notSolidObj->doSomething()
    ->doSomethingElse()
    ->addOneOfThese('this thing')
    ->addOneOfThose('that thing')
    ->removeSomething('unwanted thing')
    ->putYourLeftHandIn()
    ->takeYourLeftHandOut()
    ->shakeItAllAbout();
```

Supposedly this is good style and improves readability, but I'm in the camp that
thinks they're not actually a great idea in a lot of situations. Here's why.

## Diffs and readability

Long chains of method calls damage readability. Trying to read them sometimes
feels like watching one of those "ball in the cup" magic tricks; you struggle
to keep track of what state the object is in, and which object we've got at each
stage of the chain.

This is most obvious when reviewing diffs in version control. The whole chain
is one statement but might be arbitrarily re-arranged across lines, making it
harder to see what the effect of the change is. Inserting a line is not adding a
new statement, and removing a line is not deleting a statement.

Where we might have had helpful variable names, with a fluent interface we've
only got a long list of method calls. This makes it harder to see from the diff
alone which objects are actually involved and what work is being done.

## Static analysis

Fluent interfaces are not just harder for humans to read -- static analysis
tools can also get tripped up on them.

What often happens is that the return type of one method is a more abstract
inteface than the class the method is being called on. The static analysis tool
then continues analysing the chain based on that abstract interface instead of
the concrete class that has some more specific methods available.

The result is the analyser reports methods further down the chain as unknown
because it can't find them on the ancestor class. There's no opportunity to
annotate with doc blocks or break out methods with clearer return types, because
the whole thing is one long statement that jumps all over the inheritance chain.

This is a reason to favour composition over inheritance, as well as avoiding
fluent interfaces.

## Law of demeter

Classes with fluent interfaces are more prone to breaking the Law of Demeter.
When the encouraged style is to chain method calls together, it doesn't seem so
bad to reach through several methods and do something with an object that the
original calling class would be better off not knowing about.

What's worse is that this style often produces method names that don't even
suggest they're skipping off across the design to return instances of classes
from faraway lands. Before long, everything routinely talks to everything else
and it becomes a tightly coupled mess.

## Magic methods

## Debugging

## Hard to mock

Mockery has support but I don't like Mockery either.

## Mocking fluent interfaces in PHPUnit

To avoid this turning into a negative-only rant, I'll try to end on something
more positive. Here's a little solution to mocking fluent interfaces in tests
using PHPUnit.
