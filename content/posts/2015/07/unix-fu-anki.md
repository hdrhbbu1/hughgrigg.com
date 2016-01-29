---
title: Improving Unix-fu with Anki
slug: unix-fu-anki
date: 2015-07-01
tags:
 - Unix
 - CLI
 - Anki
---

[Anki](http://ankisrs.net/) has helped me maintain and improve my
[Chinese](https://www.chineseboost.com/blog) for years, but I've always been
intrigued by using it to develop other kinds of knowledge. At university I used
it heavily for East Asian history, our modern Chinese literature course and
classical Chinese. I've now started using it to improve my Unix command-line
fluency, and the results have been quite dramatic.

It's not really possible to _learn_ programming with an SRS system like Anki,
but you can certainly use it to reinforce tokenized knowledge (like
[this](https://developer.atlassian.com/blog/2015/06/golang-flashcards-and-
spaced-repetition/)). Whilst programming ability doesn't tokenize very well, a
lot of related computing skills certainly do.

The first thing I started reinforcing with Anki was bash and the Unix command-
line in general. It's easy to get this started with a simple rule: any time you
use `man` or Google to learn about a command, make sure to add an Anki card for
it once you've found the information you're looking for. In this way, I've ended
up with a lot of cards for the flags and options of various Unix commands. Man
pages lend themselves very well to this, as do concise answers from the likes of
Stack Overflow.

After that, I started seeking out more interesting techniques and approaches
from sites like [Commandline Fu](http://www.commandlinefu.com/commands/browse
/sort-by-votes) and general searches for Unix one-liners. This quickly created a
rabbit hole effect, and everything I found interesting ended up in my Anki deck.
With daily reinforcement of an increasing range of commands, I've found that my
Unix fluency has improved far faster than when I was trying to acquire the
knowledge organically.

From that starting point, I now regularly add cards for every tool I use, such
as Git, Vim and all the usual Unix suspects. As well as command line tools, SRS
cards also lend themselves well to snippets of programming languages. SQL fits
nicely into this model, and I've been able to commit various handy SQL phrases
and techniques to memory and avoid searching for them the next time I need them.
The amount of time I spend looking up documentation has gone down a lot, and I
use that as a rough metric of how succesful this approach is.

So far I've used two types of card for this knowledge: a traditional prompt and
response card type, and [cloze
deletion](http://www.supermemo.com/articles/20rules.htm#Cloze deletion) cards.
The prompt-reponse cards have some simple styling that suits code -- monospace
font, left alignment etc -- and usually start with a one word topic to indicate
where the knowledge applies (e.g. 'bash'). That format covers the majority of
commands, keyboard shortcuts, code snippets and language phrases, whilst the
cloze deletion cards cover items of knowledge that work better as short
sentences (such as [this kind of
guidance](https://github.com/airbnb/javascript)).

Since reinforcing my memory this way, I feel far more productive, particularly
in bash and vim as those get the most constant use. I also feel more confident
approaching new tools or languages, as I trust that I have this system backing
me up as I learn them. Further, programming and computing books are now an even
more valuable resource, as I have a realistic chance of retaining the
information that I find useful or interesting as I read through them.
