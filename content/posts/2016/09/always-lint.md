---
title: Always lint
slug: always-lint
date: 2016-09-13
author: Hugh Grigg
topics:
 - linting
 - static analysis
---

 > "lint (n): undesirable bits of fiber and fluff found in sheep's wool"

 &mdash; [Wikipedia](https://en.wikipedia.org/wiki/Lint_(software))

Linting is one of the first things I like to set up on a new project. Especially
when working with interpreted languages, it's reassuring to develop with a
mechnical helper pointing out mistakes, problems and potential improvements.

Linters exist for pretty much every language out there, and are a great addition
to the development process. Here's why.

## Linters catch bugs

Although most people don't think of it as their primary purpose, linters can
catch bugs before they even make it to execution, let alone production.

 > "10. All code must be compiled, from the first day of development, with all
   compiler warnings enabled at the compiler’s most pedantic setting. All code
   must compile with these settings without any warnings. All code must be
   checked daily with at least one, but preferably more than one, state-of-the-
   art static source code analyzer and should pass the analyses with zero
   warnings."

 &mdash; [NASA’s ten coding commandments](https://jaxenter.com/power-ten-nasas-
 &coding-commandments-114124.html)

As a language community starts to recognise recurring causes of bugs, they can
be incorporated into linting tools. Common examples might be assignment in
conditions, non-terminating loops, operator mismatch, implicit type coercion,
null pointers, division by zero and so on. It varies a lot by language. These
are simple sources of bugs, but they can also be subtle, and that's why the
linter is often better at identifying them.

Regardless of how well a human being is able to spot these errors, the point is
that a machine can also do the job. Hopefully human time is at a premium, which
is why it's better to have the linter catch these wherever possible. What can be
automated should be automated.

## Linters improve quality

After identifying some kinds of straight-up bugs, a linting tool can also
improve code quality in terms of readability, performance and design.

An area of code can function correctly and pass all its tests, but still have
basic performance problems or be a mess that no-one enjoys working with. Static
analysis tools can help with both of these issues.

> "What we need at such times is an infinitely patient, anal-retentive expert to
  inspect every inch of our code. This expert must be more thorough than any
  compiler, and should report back in a completely dispassionate way everything
  that is potentially wrong with our code."

 &mdash; [How to use lint](http://www.barrgroup.com/Embedded-Systems/How-To
 &/Lint-Static-Analysis-Tool)

In terms of performance, the linter may be able to spot a non-optimal order of
expressions, expensive operations in a loop and other long hanging fruit. Tweaks
in regexes, mergeable or redundant code and more performant solutions to common
problems may also be suggested. The linter will provide this analysis faster and
more consistently than a human reviewer, freeing them up to focus on deeper
insights into the code.

Basic readability and maintainability issues such as unused variables, functions
and parameters are also common prey for the linter. These are the sorts of cruft
that can easily accumulate over time in an application, because they're less
obvious to the human eye.

As well as performance and readability, static analysis can highlight
potentially poor design choices such as overly complex class hiearchies,
excessive function parameters and high [cyclomatic
complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity). Anyone who has
inherited a legacy code base has had that sinking feeling on opening a file to
find code with a dozen parent classes, half the application passed around in
function parameters and a soup of `if`s, `else`s, `for`s, `try`s, `catch`es and
`return`s sprayed across the editor. A linter can prevent that situation from
emerging.

You are probably conscious of these issues anyway while coding, but it's still
beneficial to have the linter, because:

 - When you're tired, distracted or in a rush, the linter is not.
 - You may learn new optimisations (see below).
 - Other people will be working on the code.
 - Knowing the linter is there lets you spend less time deliberating on small
   things and more time focusing on bigger ideas.

The last point is one of the things I like most about static analysis tools:
they reduce cognitive load whilst coding.

## Learn about the language

Beyond the more obvious benefits of reducing defects and improving quality, I
also like static analysers because they help me to learn more about the language
I'm using.

When the linter reports something that I hadn't spotted, it's a great learning
opportunity. If I was previously unware of the issue, I'll certainly Google it,
read what others have said about it and incorporate that into my work. I'm very
likely to remember this due to the slight chastisement of the linter, the
personal research and the specific example I can attach this knowledge to (my
own code).

Even if I don't agree with what the linter has reported, it's still worthwhile
knowing the rationale behind it and what other developers think about the
problem.

## Kill the paperclip

The point about disagreeing with the linter is an important one, as it's one of
the most common objections and obstacles to getting these tools involved in a
project.

The infamous paperclip from Microsoft Office springs to mind here. People hate
it when a mere machine treats them as an equal. This applies even more so to
developers, who tend to have quite a high opinion of their own level of
knowledge.

Linters are often felt to be overzealous, pedantic and insensitive. This is hard
to refute as that's kind of the point. The linter is there to nitpick, whinge
and suggest where a human being might not.

However, there are a couple of solutions to this.

Firstly, any static analysis tool worth using will be configurable down to the
rule level. If a rule is genuinely obstructing progress, it can either be
disabled for a particular offending line, or for the whole project. Many rules
can be loosened to allow for existing areas of the code that should be better,
whilst not letting the situation get any worse. Discussing and settling on a
rule set is a constructive thing for a team to do in any case.

Secondly, it's good to recognise that standards are beneficial in themselves.
That is, having a standard is generally positive regardless of what the standard
actually says. Some reasons for this include:

 - It reduces cognitive load. With a standard in place, you can stop spending
   thought cycles on side issues like how to format and arrange your code.
 - It reduces time spent debating and tweaking style.

Go has done a great job of this by not only having a clear standard, but an
automated tool ([gofmt](https://golang.org/cmd/gofmt/)) to enforce it. This lets
everyone focus on more important problems.

## Linting vs testing

There are some clear parallels between linting and testing. Both reduce bugs,
improve quality and save time in the long run.

One nice thing about linting is how easy it is to set up and use. You don't need
to write the checks yourself, and can immediately apply some accumulated wisdom
to any codebase. Static analysis tools are almost like a set of tests you get
for free out of the box.

Unit, functional and integration tests can take a lot more set up before you can
even start to write the assertions. Stubbing, mocking, configuring and so on can
easily become time-sinks. Linters, on the other hand, tend to work pretty
quickly and independently. They also run faster than a lot of automated tests.

Having both linters and an array of automated tests at different levels is
important. The two complement each other, and the more automation you have, the
better.

## See also

 - [List of tools for static code analysis](https://en.wikipedia.org/wiki/List_of_tools_for_static_code_analysis)
