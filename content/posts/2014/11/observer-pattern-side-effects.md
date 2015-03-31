---
title: The observer pattern and side effects
slug: observer-pattern-side-effects
date: 2014-11-05
tags:
 - programming
 - design patterns
---

The [observer pattern](https://en.wikipedia.org/wiki/Observer_pattern) is
extremely common in a lot of software, particularly in web apps. Most web
frameworks, ORMs and other boilerplate systems have a built in structure for
events and observers, making it easy to listen to various built-in events and to
fire customised events of your own.

The observer pattern is one of the classic design patterns -- it's number 7 in
the Gang of Four -- and is one of the patterns that I deal with most commonly
day to day. It's an attractive design pattern as it allows a lot of flexibility
in a system. For example, using observers makes it easier to adhere to the
[open-closed principle](https://en.wikipedia.org/wiki/Open/closed_principle) by
hooking into events without needing to meddle with the existing system. It often
feels "clean" to listen to an event instead of making changes to existing code.

The observer pattern is also integral to the DOM. NodeJS inherited its
asynchronous, event-driven approach from Javascript's origins as a way to
interact with the DOM in a non-blocking way. Clearly there is something pretty
good about this pattern.

However, I've come to realise that the observer pattern often leads to nasty
bugs. By its very nature, the observer pattern creates side effects, and
depending on the implementation, these can hard to track down. When poorly
implemented, it's possible for events and observers to create infinite loops. A
trivial example is something listening to a 'model save before' event then
triggering a model save, but there can be more complex and long-winded chains
that are harder to identify.

As an example, I saw a bug in a web app where two different third-party modules
(alarm bells!) both listened to a save event on a user model. These third-party
systems both wanted to know when the app updated user data. However, one of the
third-parties -- "Module A" -- also sent back more data asychronously after it
had got its update, perhaps 1-2 seconds later. In Module A, this was allowed for
to avoid creating a loop.

However, the _other_ third-party module -- "Module B" -- was then getting
secondary update information. This was already quite bad, but it was made worse
by the fact that global data in the form of the user's GeoIP and other
contextual information was being used, with the result that the app was sending
data about Module A's external API (e.g. GeoIP based on where their servers were
rather than the original user) on to Module B's API.


To make it extra fun to debug, the app ran on six separate servers, meaning that
these side effects were occuring across separate machines.

I would say all of this was caused by inappropriate side effects due to the
observer pattern being so integral to the system (in this case it was not
possible to save a model in the system without triggering several events). This
set up is common to a lot of web apps.

The problem is often due to class and method names which don't make it clear
that they're going to fire events. In any case, side effects are generally
accepted to be bad and annoying, but in the design of some systems, the observer
pattern seems to offer a licence to go around intentionally creating side
effects. It may seem justified because it's got the title of "design pattern".

[This answer on Stack Overflow](http://stackoverflow.com/a/11632412/1581544)
covers the problems with the observer pattern better than I can, so I won't go
into it here. I'm also far from the first person to consider this issue!

I write on this blog to document and improve my learning, so I feel I should
offer some suggestions to avoid this problem, despite not being any kind of
expert in this.

What springs to mind is avoiding having events sprayed liberally across the
system, and instead making them "explicit observed events". In other words, it
should be as clear as possible that an event is going to be fired. Events on
`save()` and `getFoo()` methods are ruled out. Perhaps there should be a
separate `saveWithSideEffects()` method to advertise the fact that random things
are going to happen.

To be honest, though, the approach that appeals most to me is having as small a
system as possible that gets by with a minimum of code. This is as opposed to
huge, monolithic boilerplate systems that encourage third-party extensions and
so on. The abstractions in large, flexible systems are powerful, but so far in
my journey with them it seems that all of that work going on behind the scenes
often leads to tricky bugs and a lot fo time spent digging through unexplored
territory in the code.
