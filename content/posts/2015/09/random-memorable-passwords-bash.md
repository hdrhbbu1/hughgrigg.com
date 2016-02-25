---
title: Making random memorable passwords with bash
slug: random-memorable-passwords-bash
date: 2015-09-17
tech:
 - Linux
 - Ubuntu
 - bash
---

Making secure passwords is quite a common task, and there are plenty of random
password generators around (I like the one in
[keepassx](https://www.keepassx.org/)). Making memorable passwords can be a bit
trickier, though.

A nice way to make random but memorable passwords is to use a sequence of words
and perhaps a short number ([obligatory link to xkcd](https://xkcd.com/936/)).
That kind of password is easy for a human to remember and generally hard to
brute-force, so long as the pool of possible words is large enough.

Most Linux distros come with long lists of words in dictionary files. For
example, on Ubuntu there are several word-list files in `/usr/share/dict`, and
it looks like they're long enough for this purpose; `wc -l /usr/share/dict
/british-english` gives 99156, which should be sufficiently unpredictable.

We can get as many random words we want with `shuf`:

{{< highlight bash >}}
shuf -n 3 /usr/share/dict/british-english
{{< /highlight >}}

Which gives you something like this:

{{< highlight text >}}
cargoes
cowboys
reallocating
{{< /highlight >}}

(There's always something interesting about randomly selected words. I think in
an effect similar to [apophenia](https://en.wikipedia.org/wiki/Apophenia), we
tend to see the combination as meaningful. Feel free to use the above command
for your daily horoscope.)

It's not ideal that the randomly selected words are on separate lines, though.
We can tidy that up piping to `tr` like this:

{{< highlight bash >}}
shuf -n 3 /usr/share/dict/british-english | tr -d "\n"
{{< /highlight >}}

And we get something that looks more like a usable password:

{{< highlight text >}}
nutdefensivecrocodile
{{< /highlight >}}

However, it's difficult to distinguish the inidividual words, and we're trying
to create memorable passwords here. That can be fixed by piping the lines
through `sed` first to capitalise the first letter:

{{< highlight bash >}}
shuf -n 3 /usr/share/dict/british-english | sed 's/./\u&/' | tr -d "\n"
{{< /highlight >}}

That produces things like the following:

{{< highlight text >}}
SpyingClinicDucked
TeleconferencedVagabondedBundles
WrigglyVaguestCheesecloth
{{< /highlight >}}

(I'm not making these up.)

A lot of systems require a mix of letters and numbers in passwords, and adding
some digits can't hurt the security of the password either. That can also be
achieved with shuffle:

{{< highlight bash >}}
shuf -n 3 /usr/share/dict/british-english | sed 's/./\u&/'  | tr -d "\n'"; echo $(shuf -i0-999 -n 1)
{{< /highlight >}}

That has the added benefit of getting a newline character at the end of the
output as well.

The final thing I'd change is to have the `tr` command remove anything that's
not a letter, as apostrophes and other bits and pieces reduce memorability
without adding a lot to the security of the password (you can increase the
number of words and digits if that's a concern):

{{< highlight bash >}}
shuf -n 3 /usr/share/dict/british-english | sed 's/./\u&/' | tr -cd '[A-Za-z]'; echo $(shuf -i0-999 -n 1)
{{< /highlight >}}

And now we have a convenient random memorable password generator in one line of
bash.

{{< highlight text >}}
IngestImbalancesIndeed473
EditionGasserVolleyed983
EmbracesPinstripePortlier145
DistantlyAlonzoMahjong603
QualifyLeechedSodas713
{{< /highlight >}}

I've got the command aliased to `mempass` and it's pretty handy.

{{< highlight bash >}}
alias mempass='shuf -n 3 /usr/share/dict/british-english | sed "s/./\u&/" | tr -cd "[A-Za-z]"; echo $(shuf -i0-999 -n 1)'
{{< /highlight >}}

Notice the single quotes around the whole alias with double quotes inside. If
you do it the other way round, the `echo` command at the end is run once when
assigning the alias, so you'd get the same digits at the end of every generated
password.
