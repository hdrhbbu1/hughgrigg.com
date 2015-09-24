---
title: Specification driven development
date: 2015-09-23
tags:
 - design
 - testing
---

There's a great [free ebook on test driven development](https://github.com
/grzesiek-galezowski/tdd-ebook) by Grzegorz Gałęzowski. I read a lot of books
related to programming, and this one stood out as particularly worthwhile.

Aside from a range of useful approaches and gems of understanding I got from the
book, the biggest gain for me was an appreciation that test driven development
isn't _really_ about testing as such. It could instead be named "specification-
driven development", which to me gives a better sense of what its main benefits
are (and is what TDD actually means).

On encountering the TDD concept for the first time, it's easy to assume that the
main benefit it provides is a nice test-suite for demonstrating the battle-
hardened nature of the code. After reading Grzegorz's ebook, though, I've
realised that the resulting test-suite is actually a secondary benefit that you
get for free when doing TDD. It's a great bonus, but it's not the central gain
that TDD has to offer.

As TDD is actually specification-driven development, the main benefit is that
you work with a living, executable specification that is actively telling you
what to do and how to proceed. Until you've experienced this with a real project
it's hard to believe how powerful an effect it has on your development work;
when I'd previously focused on the "test" part more than the "driven" part, this
wasn't apparent to me.

## Better workflow; better design

With specification-driven development, you gain access to a low-resistance
workflow. By this I mean that a lot of the time, the next step is small and
clear, and there's less chance of stalling on an oversized chunk of work. You're
either converting requirements or specification into something executable that
can actively demonstrate the code does what it's meant to, or you're writing
code to satisfy some part of the living specification. In either case it's
pleasantly methodical and makes it easier to get into the flow of work.

Because you're bringing the specification to life first, before you write the
code to pass the tests, you naturally write clearer, more maintainable code.
This is a well-known benefit of TDD, and it's crucial that the tests come before
the code. Writing the tests first strongly encourages you to isolate
dependencies, produce clear interfaces and favour composition over inheritance.
You end up doing those things not because you know they're good practices, but
because you want to avoid going insane when trying to write your tests. This
kind of "the best way is also the easiest" is a huge win with TDD.

## The test must fail

Another crucial aspect of specification driven development is that you must see
a test fail for it to be worth anything. You've got to see red. If you write a
test and get it to pass in one go, going straight to green (which is probably
a giveaway that you're not actually writing the test first), you can't be sure
the test is really testing what you think it is. It's only by being disprovable
that a test has any meaning.

Because of the natural workflow that comes with TDD, it's easy to achieve this.
The two things complement each other, and this is what's described in all the
TDD workflows you see. Despite that, I think that many TDD beginners still focus
on seeing the test pass more than seeing it fail. Grzegorz's book helped me
straighten that out in my work, and it's been a significant improvement.

I've also come to the realisation that test code is just as important as the
"real" code fulfilling it. It's not uncommon to hear things like "that's not
worth writing a test for" or "this is a good candidate for a unit test". Those
statements are fundamentally opposed to what specification driven development is
about. The primary role of the tests is not to catch bugs or monitor critical
areas of the codebase (although they do help with that). The tests are there to
drive a methodical workflow that naturally produces higher quality code and
improves maintainability.

Here's a quote from [Dijkstra in 1972](http://www.cs.utexas.edu/users/EWD/transcriptions/EWD03xx/EWD340.html) that explains this:

> "One should not first make the program and then prove its correctness, because
  then the requirement of providing the proof would only increase the poor
  programmer’s burden. On the contrary: the programmer should let correctness
  proof and program grow hand in hand."

Writing a failing test is the first step to producing good code. It's not
something that is awarded to good candidate code or tacked on afterwards.

## Testing is an overloaded term

When I've been using the term "tests" above, I've been talking about the kind of
unit tests you get from TDD. In other words, a living specification. I think
that is much more accurate than the term "unit tests", although they refer to
the same category of tests. This is a completely different animal to functional
testing, and only somewhat related to regression and integration testing.

Functional testing is what I think most people do when they talk about testing.
Tests are written to demonstrate that the code actually works and to increase
confidence in it. This is a good thing and should definitely be a part of
software projects, but it's not the same thing as TDD / specification driven
development. In this scope, statements like "this is a good candidate for
automated testing" make more sense; certain functions of an application are more
important than others, and with limited resources it may be wise to create
functional tests for those parts with priority over others.

The test-suite produce by TDD does help somewhat with functional testing, but
that's not its purpose. Similarly, the unit tests can contribute a little to
integration testing by confirming how individual parts try to interact with
other parts. Again, though, unit tests are ill-suited to this as they attempt to
prove assumptions rather than outright proving that an integration is giving the
overall desired behaviour.

Finally, regression testing is there to catch things that used to work but have
been broken by something you did recently. To me, this is a general byproduct of
any kind of testing. Unit tests may catch a regression in one class or
component, and functional tests may catch a regression in the behaviour of the
system overall. Again, the point with specification driven development is that
catching regressions is an excellent benefit, but not the main goal.

## Functional specification driven development

From the above you might conclude that I think a living specification can only
be built with unit tests, which is not true. The specification can very much
include functional tests, but to me that is secondary to the workflow of TDD
built around small, focused tests leading to good code in tiny increments.
Functional tests tend to be slower and do not isolate dependencies to the extent
that unit tests do. I could write functional tests and then write spaghetti code
to pass them, and it wouldn't be painful in the way it would with unit tests
driving the development.

To me, a functional specification keeps you in check from a wider perspective in
terms of general software behaviour (wouldn't it be embarrassing if all your
unit tests pass but the application doesn't actually do what it needs to),
whilst a unit test specification is the core of the workflow that guides you to
produce well-structured and understandable code.

## Tests as documentation

That point about understandable code leads on to one more bonus you get from
specification driven development (don't worry, I'm nearly done).

Documentation is a [thorny
issue](http://c2.com/cgi/wiki?ProblemsWithDocumentation) in the software
development world. It's difficult to get right and can end up being a hindrance
rather than a help to a software project.

Specification driven development doesn't replace documentation, and it doesn't
offer a lot in terms of API documentation (i.e. for people who will use the
functionality of your code but don't want to care about its internals). What it
does offer, though, is an excellent commentary on your intent as a programmer
and what your code is trying to do.

The unit tests are often much better than comments at clarifying your code to
other developers who need to work with it, or to your future self when you've
forgotten the details. This is because the TDD approach makes you write clearer
code in the first place, and also because it actively documents how it works.

A section of Grzegorz's book that I particularly like is the chapter on
[constrainted non-determinism](https://github.com/grzesiek-galezowski/tdd-
ebook/blob/master/manuscript/110_Constrained_Non_Determinism.md). The
introduction states:

> "Tests should not only pass input values to an object and assert on the
  output, they should also convey to their reader the rules according to which
  objects and functions work."

The chapter then explains how unit tests can be made to express intent and
effectively comment the code they're exercising. There are a lot of interesting
aspects to this such as anonymous input, imbuing meaning into the test code and
finding ways to have the test read like a specification. I recommend reading the
whole book to see all it has to offer.

## Wrap up

For some people this post will have been stating the obvious. There's nothing
new in these ideas; it is just TDD. What I wanted to write up was my own recent
learning experience around this topic, and to recommend Grzegorz's book as it
was so helpful.
