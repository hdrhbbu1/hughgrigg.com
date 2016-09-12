---
title: Boring considered beneficial
slug: boring-considered-beneficial
date: 2016-05-23
author: Hugh Grigg
topics:
 - Design
 - Design patterns
---

Being boring is a good thing in software design.

There is no benefit to being impressive with a design, or to demonstrate one's
knowledge in code. Doing that is likely to cause problems and reduce the quality
of the software.

One aspect of the programming profession is that there is both an urge and
plenty of opportunity to try to show off. We are continually learning and
improving, as we should be, and this can lead us to actively seek out
opportunities to use the interesting knowledge we have acquired, instead of
putting it to use when a concrete need for it arises.

Alex Papadimoulis [writes about this](http://thedailywtf.com/articles/Programming-Sucks!-Or-At-Least,-It-Ought-To-) convincingly:

> "“Tedious” and “boring” are two words that don’t sit well with developers.
> We’re an analytical bunch and oftentimes come with a computer science degree.
> And we’re much more capable than tying a front-end and a back-end together
> using line after line of code. Perhaps we could even use our skills and
> capabilities to make our job easier.
>
> And therein lies the rub. As Michael A. Jackson said in his 1975 Principles of
> Program Design, “Programmers… often take refuge in an understandable, but
> disastrous, inclination towards complexity and ingenuity in their work.
> Forbidden to design anything larger than a program, they respond by making
> that program intricate enough to challenge their professional skill.”
>
> This thirty-five year-old observation is confirmed day-in and day-out here on
> TDWTF. Some of the most egregious code and stories written here stem from the
> developer’s desire for cleverness. Carrying out these desires is neither
> malicious nor devious, but merely instinctual."

Here are a few thoughts on the topic in no particular order.

## Means and ends

This issue frequently occurs when means are confused with ends. A common example
is the use of design patterns in OOP programming. It's not unusual to see design
patterns become the goal in an area of code, instead of being used as a
necessary approach to actual problems.

Here's a take on this [from Matthew P Jones](https://www.exceptionnotfound.net
/software-design-patterns-are-not-goals-they-are-tools/):

> "What patterns don't help with is the initial design of a system. In this
> phase, the only thing you should be worried about is how to faithfully and
> correctly implement the business rules and procedures. Following that, you can
> create a "correct" architecture, for whatever correct means to you, your
> business, your clients, and your code standards."

To be clear, I am not saying that design patterns are inherently bad or never
useful. The point here is that based on my experience so far, they are more
commonly implemented as an end unto themselves, and that is detrimental to the
production of good software.

<div class="img">
	<img src="/img/2016/05/design-patterns-pokemon.png"
		alt="Design Patterns Pokémon">
</div>

I much prefer to work on code that focuses on keeping things simple, modular and
direct than code that tries to shoe-horn in a lot of patterns. Small classes,
short methods and limited indentation will probably do more good than going
straight for a [SimpleBeanFactoryAwareAspectInstanceFactory](https://docs.s
pring.io/spring/docs/2.5.x/javadoc-api/org/springframework/aop/config/SimpleBean
FactoryAwareAspectInstanceFactory.html).

A quote [from Jeff Atwood](https://blog.codinghorror.com/rethinking-design-
patterns/):

> "Design patterns are a form of complexity. As with all complexity, I'd rather
> see developers focus on simpler solutions before going straight to a complex
> recipe of design patterns."

It also bothers me when established design patterns seem to be the only ordained
way to organise code. Again, that view leads to over-complication. Quite often,
there is a small, relatively simple way to address a situation that uses one or
two more classes or interfaces. It doesn't matter if there's a name for this
arrangement or not. It's about having specific solutions to specific problems,
and not creating abstraction for the sake of it.

It's easy to overlook how far the OO in OOP can take you without thinking
explicitly about official design patterns. Use objects for things, encapsulate
and keep it simple.

Two more quotes from Jeff Atwood, one about [keeping it simple](https://blog.codinghorror.com/kiss-and-yagni/):

> "Don't use fancy OOP features just because you can. Use fancy OOP features
> because they have specific, demonstrable benefit to the problem you're trying
> to solve. You laugh, but like Rico, I see this all the time. Most programmers
> never met an object they didn't like. I think it should be the other way
> around: these techniques are guilty until proven innocent in the court of
> KISS."

... and another [about design patterns](https://blog.codinghorror.com/head-
first-design-patterns/):

> "Do you really want a junior developer using patterns everywhere? It's about as
> safe as encouraging them to "experiment" with a gas-powered chainsaw. The best
> way to learn to write simple code is to write simple code! Patterns, like all
> forms of compexity, should be avoided until they are absolutely necessary.
> That's the first thing beginners need to learn. Not the last thing."

There's [an interesting
study](http://www.ucd.ie/artspgs/semantics/ConsequencesErudite.pdf "Consequences
of Erudite Vernacular Utilized Irrespective of Necessity: Problems with Using
Long Words Needlessly") about how using longer words does not make you appear
more intelligent; in fact, it makes people see you as less intelligent. That may
have some relevance in the world of complex software design.

## Predicting the future

Attempts to predict the future are another source of needlessly interesting
software design. Trying to do this is a well-known bad practice, and there's an
acronym to counter it: [YAGNI](http://c2.com/cgi/wiki?YouArentGonnaNeedIt). The
choice quote on that is probably:

> "...unless your universe is very different from mine, you can't 'save' time by
> doing the work now, unless it will take more time to do it later than it will
> to do now."

That doesn't quite touch upon how this idea tends to introduce pointless
complexity. In trying to predict how things will change in the future, it's
common to design with extra abstraction in the areas we believe may change. It's
as if we're thinking "if I can just abstract this enough, then any change will
be easy."

You can't predict the future. Trying to guess how requirements will change and
pre-implement solutions now almost never improves things. It is nearly always
better to implement changes once there is a specific need to do so. At that
point, you've got the concrete information available to make good decisions.
Unambiguous reality leads to better solutions than under-informed guesswork.

## Selection by hype

This post was first inspired by [one that Dan McKinley
wrote](http://mcfunley.com/choose-boring-technology), so it wouldn't be complete
without a quote from him there:

> "If you choose to write your website in NodeJS, you just spent one of your
> innovation tokens. If you choose to use MongoDB, you just spent one of your
> innovation tokens. If you choose to use service discovery tech that's existed
> for a year or less, you just spent one of your innovation tokens. If you
> choose to write your own database, oh god, you're in trouble."

It is far from unusual to choose technology because it is new, cool and being
written about by random people on blogs. Everyone worries about being left
behind, rather than jumping on a ship that might not be headed anywhere
particularly good.

As far as I can tell, selecting by hype is rarely a disastrous decision
(although it might be), but tends to introduce a whole set of problems and extra
work that would have been avoided with a boring choice.

Also, [this](http://www.mongodb-is-web-scale.com/).

## Hiring

There's not a shortage of people writing about how hiring practices are broken
in the software industry, so I won't go into a lot of detail about it here other
than to point out that certain hiring practices can contribute to this problem.

Candidates applying for software development positions are often encouraged to
be impressive during the hiring process. This makes sense, as an employer wants
to see the candidate's skills in action. However, the result can be a focus on
spurious design patterns, over-complicaton and hype-selected technologies. This
is certainly not universal, but neither is it uncommon.

This may be hard to avoid, but just as I am more impressed by someone who can
express themselves clearly and directly without using rare words or complex
expressions, I would also be more impressed by someone who can solve software
problems simply, directly and with a minimum of fluff.
