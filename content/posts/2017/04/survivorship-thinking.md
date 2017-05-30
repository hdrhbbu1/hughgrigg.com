---
title: Survivorship Thinking
slug: survivorship-thinking
date: 2017-05-23
author: Hugh Grigg
topics:
 - Concepts
---

The [survivorship bias](https://en.wikipedia.org/wiki/Survivorship_bias) is one
of the most interesting cognitive biases to know about ([cliché XKCD
link](https://xkcd.com/1827/)).

It's the idea that our impression of a given set of things is biased towards
those that have survived some selection pressure. The classic example is when
people say "they don't make 'em like they used to". With a moment's thought, you
realise that of course all the old things we see today are well made. The
poorly-made things of the past don't survive through to the present.

Another example is the idea that music, art or architecture were better in the
past. Again, the bad material simply doesn't survive the generations to still be
around in the present day. Time is a good filter. This must be a factor in a lot
of "Golden Age" thinking.

Here's a quote from Ambrose Bierce's _Devil's Dictionary_ about the survivorship
bias:

> DAWN, n. The time when men of reason go to bed. Certain old men prefer to rise
  at about that time, taking a cold bath and a long walk with an empty stomach,
  and otherwise mortifying the flesh. They then point with pride to these
  practices as the cause of their sturdy health and ripe years; the truth being
  that they are hearty and old, not because of their habits, but in spite of them.
  The reason we find only robust persons doing this thing is that it has killed
  all the others who have tried it.
  
  &mdash; Ambrose Bierce

This type of thinking seems to be quite common in the business world, especially
in technology. "Companies A, B and C use these languages / technologies /
development methodologies, and they're doing great." Those languages,
technologies and methodologies could be neutral at best, and it is some other
factor that has caused companies A, B and C to survive. No mention is made of
companies X, Y and Z who failed with the same choices, because they're now
invisible.

There are more examples in the Wikipedia article linked above.

Another idea that springs to mind is a type of scam that works via the
survivorship bias. The scammer gets 10000 email addresses, and sends 5000 an
email predicting a stock will go up, and the other 5000 an email predicting the
stock will go down. Once the result is out, they discard whichever half happened
to get a wrong answer, and do it again. 2500 get an email saying a particular
stock will go up, and 2500 see a predicition it will go down.

After doing this 10 times, the scammer has whittled down the 10000 email
addresses into a handful of people who have now received a series of 10
miraculously accurate stock predictions. They are prime targets to fall victim
to some fraudulent financial product.

A simpler version of the scam is to offer a service predicting the gender of
unborn babies, with a money back guarantee if the prediction is wrong. You can
legitimately keep 50% of all the money you receive.

## Useful survivorship thinking

The survivorship effect explains why index trackers tend to outperform manual
stock picking in the long term. The index naturally prunes off the less valuable
stocks and brings on rising new ones. It's a view of the highest value stocks at
any one time. Going further, the market can be seen as a set of [recursive
selection pressures](http://nautil.us/blog/to-become-a-better- investor-think-
like-darwin) that shape both the entities in it and the environment itself.

There are some useful implications of the survivorship effect for software
development, in particular for testing and legacy software.

Manual and automated testing can both be seen as selection pressures that shape
the development of software. The more pressures there are and the stronger they
act, the more quickly the software will take on a desirable form.

Whilst legacy software is usually loathed by the developers who have to work on
it, the business case for its continued use is clear. It's been through a long
survivorship process and demonstrated that it can do the job in an acceptable
way. Replacing the legacy system with something new is not only immediately
expensive in development costs. It also requires a fresh survivorship process to
take place, not only to weed out weaknesses but also to produce a robust set of
acceptance criteria (like bugs, these often only genuinely emerge from
production use).

Intuitively, we know that software that has been in use for longer is likely to
be more robust than newer software. This is because live use is the ultimate
selection process for weeding out weaker parts of the system and keeping the
stronger parts in check. This is a good argument for increasing the number of
automated tests and emulating as much production work as possible in the tests:
better to present only the survivors to real users, rather than let users select
the survivors themselves.
