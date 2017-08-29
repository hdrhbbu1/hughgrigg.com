---
title: Dates for booleans
slug: dates-for-booleans
date: 2017-07-23
author: Hugh Grigg
topics:
 - Data modeling
 - Databases
 - Learning
 - Schema design
---

Here's a little maxim for data modeling: **use dates instead of booleans**. In a
lot of situations, this lets you capture more information without losing
anything compared to a boolean.

A common example is implementing a status column with a datetime `foobared_at`
column instead of a boolean `is_foobar`. If it's null, then that row is not
foobar. If the column is filled, then you not only know that it is foobar, but
also since when.

Having that extra information is often useful for debugging, but can also be
good for implementing business logic. For example, you might want to email all
users who subscribed to your newsletter in the last week to send them an
introductory offer. You can't do that with a boolean `subscribed` column, but
it's easy with a datetime `subscribed_at`.

A further improvement in that data model would be to have a `subscriptions`
table with a foreign key to your users, with the `created_at` or `updated_at`
column on the subscriptions table holding this information.

This approach is often taken to implement soft deletes with a `deleted_at`
column, but I tend to agree with this StackOverflow answer explaining how [soft
deletion is usually an
antipattern](https://stackoverflow.com/a/9564779/1581544). Soft deletion is
convenient and supported by many database management libraries, but causes
complexities in all queries and can lead to various bugs and annoyances as
described there.

In any case, having a preference for date columns instead of booleans means you
can gather extra information while it's available so that it's there if you need
it later. Looking at it another way, [boolean
flags](https://www.martinfowler.com/bliki/FlagArgument.html) are often an
[antipattern](http://blog.iannelson.systems/back-to-basics-on-the-use-and-abuse-
of-the-humble-boolean/), and using a datetime instead can mitigate that. Just
make sure that there isn't a better solution that lets you avoid this kind of
flag logic altogether.
