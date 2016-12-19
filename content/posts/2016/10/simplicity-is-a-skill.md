---
title: Simplicity is a skill
slug: simplicity-is-a-skill
date: 2016-10-23
author: Hugh Grigg
topics:
 - Concepts
 - Design
---

After a lot of peer reviews and looking back at my own work recently, I've been
considering the point I was trying to get across in "[Boring considered
beneficial]({{< relref "boring-considered-beneficial.md" >}})".

One of the main thoughts there was that approaches and technologies sometimes
considered boring or traditional have that perception for a reason: they've
become mature enough to generally work and solve problems in a straightforward
way. The community is used to them, so they're not as exciting as more novel and
exotic ways of solving the same problems.

That's the exact reason the standard approaches should be a first choice:
they've been under selection pressures for long enough that you know they're
good.

That leads to the point of this post. Why are novel, intricate and idiosyncratic
choices so attractive to those of us making software implementation decisions?

The quote-within-a-quote from the previous post takes us towards an answer:

> "Programmers… often take refuge in an understandable, but disastrous,
  inclination towards complexity and ingenuity in their work."

  &mdash; [Jackson, Principles of Program Design](http://www.worldcat.org/oclc/1820774)

This is interesting -- we know that simpler solutions are likely to require less
work and lead to better solutions, yet we're inclined not to choose them. This
is despite principles like [KISS](http://wiki.c2.com/?KeepItSimple) being pinned
on the walls of most software development offices.

I think a large part of the problem is that we don't value simplicity highly
enough as a skill. There is an obvious aspect to "simplicity as a skill" that is
easy to see the value in: the ability to reduce complex problems to simple parts
and then solve them. Few people would have trouble agreeing that that's a great
ability to have, especially for software developers.

But there's another aspect to simplicity being a skill which is the point here:
the ability to resist and reject more complex solutions in favour of less
ingenious ones.

There are many ways to justify going towards complexity which generally boil
down to a desire to impress oneself and others, and to exercise the part of the
mind that deals with solving puzzles. These solutions can be quite enjoyable,
and a source of pride, and I think that's why a lot of them end up in codebases
where a simpler solution would not just have sufficed but actually have been
better.

It's easy to let arguments for abstraction, future-proofing, good design and so
on override the more fragile point that real simplicity is generally more
valuable than those.

Sometimes the simplest thing is to abstract, future-proof or generalise, but
usually it is not. The simplest thing often seems embarrassingly
straightforward, and being able to embrace that is a skill in itself.
