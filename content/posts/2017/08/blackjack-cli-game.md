---
title: Blackjack CLI game
slug: blackjack-cli-game
date: 2017-08-28
author: Hugh Grigg
tech:
 - golang
 - Linux
topics:
 - CLI
 - Games
 - Projects
---

The first draft of a [blackjack cli
game](https://github.com/hughgrigg/blackjack) I'm making is now finished.

![Blackjack screenshot](/img/2017/blackjack-01.png)

If you have Go installed then you should be able to play the game with:

```bash
go get -u github.com/hughgrigg/blackjack
blackjack
```

It's a single-deck blackjack betting game written in Go for the command line.
I've only tried it on Linux, but it uses the [termui
library](https://github.com/gizak/termui) so I imagine it would be OK on OSX as
well. Not sure about Windows.

The game has the standard blackjack mechanics including doubling down and
splitting hands. There are still a few rough edges but it serves my purposes as
a playable blackjack game.

The project has been quite educational as it's the first thing I've done in Go,
and is also a different style of project to the Web development that I usually
do. Inevitably there's a lot that could be improved, but it's been a good
learning experience.
