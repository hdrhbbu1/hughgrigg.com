---
title: Using Wget for recursive downloads
slug: wget-recursive-downloads
date: 2015-05-31
tags:
 - Unix
 - CLI
tech:
 - command line
 - vim
 - bash
 - wget
 - Linux
---

I discovered the [VimCasts](http://vimcasts.org/) website recently and have been
watching a few of their videos. Due to my unreliable internet connection, I
prefer to download whole video files and then watch them (this also allows
watching them on portable devices).

VimCasts allow directory listing on their [storage
server](http://media.vimcasts.org/videos/), which I believe is permission to
bulk download their content. The only issue is that each episode is stored in
its own subdirectory and in two formats. I don't want the folder structure and I
only want one of the formats.

At first I tried using a couple of different browser extensions that are
supposed to automate this, before I realised that Linux command line tools must
be able to do this.

The first attempt just used the recursive feature of `wget`:

{{< highlight bash >}}
wget -r http://media.vimcasts.org/videos/
{{< /highlight >}}

Unfortunately that also traverses up the directory structure and gets out of
control, but that's fixed with:

{{< highlight bash >}}
wget -r --no-parent http://media.vimcasts.org/videos/
{{< /highlight >}}

This is better, and we end up with a clone of the subdirectories and their
contents. I only want the ogv files, though, which is also possible with wget:

{{< highlight bash >}}
wget -r --no-parent --accept ogv http://media.vimcasts.org/videos/
{{< /highlight >}}

Finally, I don't particularly want the folder structure, just the files. That
can also be covered with wget's options, so the final command that does exactly
what I want is:

{{< highlight bash >}}
wget -r --no-parent --accept ogv -nd http://media.vimcasts.org/videos/
{{< /highlight >}}

That goes off and downloads all OGV files in subdirectories, flattening the
folder structure and giving very readable output as it does it.

![wget recursive download output](/img/2015/05/wget-recursive-download-output.png)

Another joy of using Linux.
