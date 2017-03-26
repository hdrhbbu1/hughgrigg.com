---
title: "Algorithm Design Exercises 1.7"
slug: algorithm-design-1.7
date: 2017-03-23
topics:
 - Learning
 - Computer Science
 - Algorithms
 - Data structures
 - Teach Yourself CS
---

These are the exercises for chapter 1 of _The Algorithm Design Manual_.

## 1-1

> Show that $a + b$ can be less than $min(a,b)$

Where $a,b < 0$, e.g. if $a = -1, b = -2$, then $a + b = -3 < min(a,b) = -5$.

## 1-2

> Show that $a \times b$ can be less than $min(a,b)$

Where one of $\\{a,b\\}$ is negative and one is positive, e.g. if $a = -1, b =
2$, then $a \times b = -2 < min(a,b) = -1$.

## 1-3

> Design/draw a road network with two points $a$ and $b$ such that the fastest
  route between $a$ and $b$ is not the shortest route.

E.g.

{{< text-diagram >}}
a──────c──────b
│             │
│             │
└────┐   ┌────┘
     └─d─┘
{{< /text-diagram >}}

If $\overrightarrow{acb}$ is less distance than $\overrightarrow{adb}$, but
there is a single lane bridge with traffic lights at $c$, then
$\overrightarrow{adb}$ can be the faster route despite not being the shortest.

## 1-4

> Design/draw a road network with two points $a$ and $b$ such that the shortest
  route between $a$ and $b$ is not the route with the fewest turns.

E.g.

{{< text-diagram >}}
      ┌┐
      ││      
      ││
      ││
      ││
      ││
a─────┘└c────b
│ ┌┐┌┐   ┌┐  │
└─┘└┘└─d─┘└──┘
     
{{< /text-diagram >}}

The route $\overrightarrow{adb}$ has 13 turns and a distance of 23, while the
route $\overrightarrow{acb}$ has 4 turns but a distance of 25.

## 1-5

> The knapsack problem is as follows: given a set of integers
  $S = \\{s_1,s_2,...s_n\\}$, and a target number $T$, find a subset of $S$
  which adds up exactly to $T$. For example, there exists a subset within
  $S = \\{1,2,5,9,10\\}$ that adds up to $T = 22$ but not $T = 23$.

> Find counterexamples to each of the following algorithms for the knapsack
  problem. That is, giving an S and T such that the subset is selected using the
  algorithm does not leave the knapsack completely full, even though such a
  solution exists.

&nbsp;

> (a) Put the elements of $S$ in the knapsack in left to right order if they
  fit, i.e. the first-fit algorithm.

E.g. $S = \\{1,3,2\\}$ and $T = 5$. The solution is $\\{3,2\\}$, but this
algorithm will first select $\\{1,3\\}$ and then be unable to make the target.

> (b) Put the elements of $S$ in the knapsack from smallest to largest, i.e. the
  best-fit algorithm.

Can use the same set as for _(a)_, above. In size order it's $S = \\{1,2,3\\}$,
when $T = 5$ this algorithm will first select $\\{1,2\\}$ and then be unable to
make the target.

> \(c\) Put the elements of $S$ in the knapsack from largest to smallest.

E.g. $S = \\{1,4,2\\}$ and $T = 3$. This algorithm will first select
$\\{4,2\\}$ and go over the target.

## 1-6

> The set cover problem is as follows: given a set of subsets $S_1,...,S_m$ of
  the universal set $U = \\{1,...,n\\}$, find the smallest subset of subsets
  $T \subset S$ such that $\cup\_{t_i \in T} t_i = U$.

> For example, there are the following subsets, $S_1 = \\{1,3,5\\}$,
  $S_2 = \\{2,4\\}$, $S_3 = \\{1,4\\}$ and $S_4 = \\{2,5\\}$. The set cover
  would then be $S_1$ and $S_2$.

> Find a counterexample for the following algorithm: Select the largest subset
  for the cover, and then delete all its elements from the universal set. Repeat
  by adding the subset containing the largest number of uncovered elements until
  all are covered.

This seems similar to algorithm _\(c\)_ for the knapsack problem above. E.g. for
the following set of sets:

 - $U = \\{1,2,3,4,5,6,7,8\\}$
 - $S_1 = \\{1,2\\}$
 - $S_2 = \\{7,8\\}$
 - $S_3 = \\{3,4,5,6,7\\}$
 - $S_4 = \\{1,2,3,4\\}$
 - $S_5 = \\{5,6,7,8\\}$

The optimal solution is $\\{S_4,S_5\\}$ with a size of 2, but this algorithm
will select $\\{S_3,S_1,S_2\\}$ or $\\{S_3,S_1,S_5\\}$ each with a size of 3.
