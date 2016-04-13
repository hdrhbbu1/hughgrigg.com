---
title: Chinese strftime
slug: chinese-strftime
author: Hugh Grigg
date: 2016-04-05
tech:
 - GNOME
 - Go
 - JavaScript
 - Linux
 - MATE
 - Moment.js
 - tmux
 - Ubuntu
---

I've always used some variation of the original GNOME desktop: GNOME 2, Cinnamon
and currently MATE. All of those desktops feature a similar calendar applet that
lets you enter a strftime string to get the date formatted how you like it.

To get a tiny bit more Chinese into my day, I use this format:

`%Y年%m月%e号 %A %p%l点%M分%S秒`

(The main reason I'm writing this post is to keep the format easily accessible
(somewhere.)

If used with `date` that gives you something like this:

```bash
LC_ALL=zh_CN.UTF-8 date +'%Y年%m月%e号 %A %p%l点%M分%S秒'
```

`2016年04月13号 星期三 下午 7点54分23秒`

It's not a practical date format that a native speaker would be likely to use,
but it gets in as much Chinese as possible.

## Go

Go's date formatting is quite interesting in that it uses a sample date (_Mon Jan
2 15:04:05 -0700 MST 2006_) instead of  placeholders. So to get this format with
a Go date:

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	fmt.Println(time.Now().Format("2006年1月2号 Monday PM 3点04分05秒"))
}

```

Unfortunately that gives us the day of the week and meridian in English. The
simplest work-around is probably just conversion tables:

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	var zhWeek = [...]string{"天", "一", "二", "三", "四", "五", "六"}
	var zhMerid = map[string]string{"AM": "上午", "PM": "下午"}
	var t = time.Now()
	fmt.Printf(
		t.Format("2006年1月2号 星期%s %s3点04分05秒\n"),
		zhWeek[t.Weekday()],
		zhMerid[t.Format("PM")],
	)
}
```

The above demonstrates one advantage of Go's approach to date formatting: it's
easy to combine with other string formatting.

## JavaScript

Moment.js lets you do something similar in JavaScript, and has locale support:

```javascript
moment().locale("zh-cn").format("YYYY年M月D号 dddd Ah点mm分ss秒");
```

Which gives you this:

<code id="show-time">...</code>

<script defer src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.12.0/moment.min.js"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.12.0/locale/zh-cn.js"></script>
<script>
	function initTick() {
		var el = document.getElementById("show-time");
		window.setInterval(function () {
			el.textContent = moment()
				.locale("zh-cn")
				.format("YYYY年M月D号 dddd Ah点mm分ss秒");
		}, 1000);
	};
	window.onload = initTick;
</script>

## tmux

I'm also using this in [my
tmux](https://github.com/hughgrigg/dotfiles/blob/master/tmux.conf) status bar:

```bash
set -g status-right "#[fg=blue]#S #I:#P #[fg=yellow]:: #(LC_ALL=zh_CN.UTF-8 date '+%%Y年%%m月%%e号 %%A') #[fg=green]:: #(LC_ALL=zh_CN.UTF-8 date +%%p%%l点%%M分%%S秒)" 
```

One thing that was slightly awkward was forcing `date` to use the Chinese locale
and having to double-escape the placeholder strings.
