---
title: That code is ugly for a reason
slug: ugly-code
date: 2015-05-27
tags:
 - programming
 - design
 - Joel on Software
 - Fog Creek
tech:
 - Magento
 - PHP
---

Before I really got into development, I went through the entire archive of [Joel
on Software](http://www.joelonsoftware.com/) reading every single article. I
like to think that it set me up with good foundational knowledge for
professional software development, but that's pretty hard to prove.

Recently I re-read the article [Things You Should Never Do, Part
I](http://www.joelonsoftware.com/articles/fog0000000069.html). With a lot more
development experience under my belt, the article spoke to me much more strongly
this time around.

I currently work on a large and highly-customised Magento installation. Our team
likes to joke about Magento and how we have to battle with it to achieve
business goals. These criticisms are often justified, sometimes in Magento core
code and frequently with third-party modules.

When reading the _Joel on Software_ article, though, I reassessed my opinion of
Magento to some extent. I still think it's a beast to work with, but you've got
to admit that it is battle-hardened and in all of its complexity does manage to
do its job correctly a lot of the time in very varied situations.

This part of the article felt most relevant to Magento's situation:

> "Back to that two page function. Yes, I know, it's just a simple function to
  display a window, but it has grown little hairs and stuff on it and nobody
  knows why. Well, I'll tell you why: those are bug fixes. One of them fixes
  that bug that Nancy had when she tried to install the thing on a computer
  that didn't have Internet Explorer. Another one fixes that bug that occurs in
  low memory conditions. Another one fixes that bug that occurred when the file
  is on a floppy disk and the user yanks out the disk in the middle. That
  LoadLibrary call is ugly but it makes the code work on old versions of
  Windows 95."

When working with Magento, you come across so much code that the above quote
applies to. A lot of it is genuinely bad without a good justification, but now
I've come to appreciate that ugly code is sometimes like that for a reason. From
that I almost have a new-found respect for Magento (but not quite -- I would
never choose to use it); all that ugliness is powering a large sector of
ecommerce across the web in a wide variety of environments and situations, and
generally doing quite a consistent job of it (I still can't bring myself to use
the phrase 'good job' here).

A large part of the frustration of working with Magento is the high level of
abstraction it starts at before slowly extending its way down to actually doing
some work. This leads to two issues for developers: difficulty in isolating
where the real work is done and safely making atomic changes; and the impact of
that on the community and ecosystem that surrounds Magento.

I have mixed feelings about heavy abstraction in software design. When designing
a system, it's tempting to abstract heavily to allow flexibility in dealing with
any possible change that might arise in future. Supposedly it's possible to
identify anything that might change and thus abstract around it in the design.
What can often result from this approach, though, is a design that is so
abstracted and flexible that it fails to clearly and concisely describe the
problem domain. Instead, everything is described vaguely and even essential
behaviour can become implicit and subtle rather than explicit and obvious.

Magento is an example of this. Simply understanding the current approach and
behaviour is not trivial, which leads to bugs that may span tens of thousands of
lines of code. That result is inevitable for Magento due to its goal of being
totally flexible to every possible ecommerce situation that any business using
it may encounter. With that design goal, everything must be as abstract as
possible as nothing has any degree of safety from future change.

This then leads to a community surrounding Magento that takes wildly different
approaches to a huge array of problems that the platform may need to solve for
its users. Users and third-party vendors are encouraged to wade into this Jenga-
like tower of abstraction, modifying, removing and inserting bricks at every
level.

When the bugs emerge (and emerge they do), you find yourself stepping through
what can arguably be called OOP spaghetti trying to determine at what level of
the tower this particular problem is hiding. The way Magento leaps around
between different levels of abstraction, with customised and third-party code
mingled at various points, feels unpleasantly like working with `GOTO`. This is
compounded by PHP's weak type system and relaxed approach to side-effects, which
can make it difficult to reason about the intention and effects of the functions
you're looking at.

When encountering this situation, I keep wondering what the system would look
like if it had instead been made with a focus on
[YAGNI](http://c2.com/cgi/wiki?YouArentGonnaNeedIt). As I said above, YAGNI is
the opposite of Magento's approach, so Magento could never have been made that
way. What I wonder about is how it would work out for an organisation that might
have used Magento to instead build a minimalist, close-to-the-probem-domain
system that only adds abstraction when it is clearly necessary to elegantly
approach an existing situation. I'm not an expert on this, but my feeling is
that that's when the design patterns and abstraction should come in to produce
an effective and manageable system, rather than trying to pre-empt any and every
potential for change which is imagined before it ever occurs.

Here's a nice quote from [an interview with Pete
Goodliffe](http://blog.fogcreek.com/going-beyond-code-to-become-a-better-
programmer-interview-with-pete-goodliffe) that relates to this:

> "If you don’t write enough code, it doesn’t do what it’s supposed to do, but
  just avoiding all those points of needless generality. Don’t make abstracts
  interfaces, don’t make deep hierarchies that don’t need to be extended, if
  you don’t need to extend them."

My take on this turned into a bit of rant, which wasn't my original intention
when writing this article, but this does lead to a nice conclusion. That kind of
ugly code is often ugly for a reason: both due to accumulated fixes for a
variety of problems, but also because of a need to deal with excessively complex
possibilities in one scope, which in turn can be a product of highly abstracted,
flexible designs. It's certainly a mixed bag.

I'd like to recommend a book I've been reading recently that I've found very
relevant to these issues: [Working Effectively with Legacy Code, by Michael
Feathers](http://c2.com/cgi/wiki?WorkingEffectivelyWithLegacyCode). Not only
does this book provide a useful set of approaches and tactics for dealing with
this kind of situation (focusing largely on how to get legacy code under test in
order to safely refactor it), it also presents a good attitude, which is to take
on these types of systems as an interesting technical challenge rather than a
horrible chore.

Finally, one more quote from the Fog Creek blog post:

> "One thing I know about well crafted software that basically has the necessary
  complexity but none of the unnecessary complexity is when I look at it, it
  looks obvious. That is the key hallmark of some excellent code. You look at
  it and you just think, “You’ve been working on that for a while” and I look
  at it and I go, “That’s clearly right.” And you know it wasn’t simple to
  write. When you look at it the solution’s simple, the shape is simple. All I
  can say is, that’s what we should strive for."
