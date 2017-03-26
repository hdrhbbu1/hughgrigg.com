---
title: "Getting started with Teach Yourself CS: Algorithms and Data Structures"
slug: getting-started-teach-yourself-cs-algorithms-data-structures
date: 2017-03-17
topics:
 - Learning
 - Computer Science
 - Algorithms
 - Data structures
 - Teach Yourself CS
---

The website [TeachYourselfCS.com](https://teachyourselfcs.com/) was recently
featured on Hacker News, and after reading through I've decided to embark on a
new learning journey by going through one of its subjects as properly as I can.

The subject I've chosen is [Algorithms and Data
Structures](https://teachyourselfcs.com/#algorithms), as I think that will be
most interesting to me personally, and will have the most immediate practical
application in the kinds of things I like to do.

I'm very grateful that the recommended lecture series, [Skiena's Algorithms
Lectures](https://www3.cs.stonybrook.edu/~algorith/video-lectures/), is freely
available online ([YouTube copy](https://www.youtube.com/watch?v=ZFjhkohHdAA&list=PLOtl7M3yp-DV69F32zdK7YJcNXpTunF2b)), as are [course
documents](https://www3.cs.stonybrook.edu/~skiena/teaching/) for that course and
various others. I was also able to find a copy of _The Algorithm Design Manual_
with a quick search.

I may be making some notes for myself here as I work through the course. That
was the main motivation behind
[EastAsiaStudent.net](https://eastasiastudent.net/) and a lot of the posts here,
as it can be a good way to focus, and also makes an easy reference for me to go
back over later.

## Lecture 1: Introduction to algorithms

[Lecture video](https://www3.cs.stonybrook.edu/~algorith/video-lectures/2012/CSE373_(CSE373-01)_2013_Spring_2013-01-29.html)
([YouTube](https://www.youtube.com/watch?v=ZFjhkohHdAA&list=PLOtl7M3yp-DV69F32zdK7YJcNXpTunF2b)), [lecture notes](https://www3.cs.stonybrook.edu/~skiena/373/newlectures/lecture1.pdf).

### Sorting

(I'm just making these initial notes in order to play around with
[MathJAX](https://gohugo.io/tutorials/mathjax/).)

Sorting is a classic example of an algorithmic problem, and can be defined as:

{{< mjx-block >}}
Input: A sequence of $N$ numbers $a_1...a_n$  
Output: The permutation of the sequence such that $a_1 \le a_2 ... \le a_n$
{{< /mjx-block >}}

### Robot tour

Another example of an algorithmic problem. Given a set of pins arranged on a
circuit board, find the shortest path for a robot arm to connect all the pins.

Someone suggests [Dijkstra's
algorithm](https://en.wikipedia.org/wiki/Dijkstra's_algorithm), but this is not
suitable as it's about finding the shortest path between two points, and not the
shortest tour across several points.

#### Brute force

A possible _correct_ algorithm is brute force: determine all potential tours and
select the one with the shortest total distance:

{{< mjx-block >}}
$d = \infty$  
For each of the $n!$ permutations $\Pi_i$ of the $n$ points:  
	If $(cost(\Pi_i) \le d)$ then  
		$d = cost(\Pi_i)$ and $P_{min} = \Pi_i$  
Return $P_{min}$
{{< /mjx-block >}}

This would take forever, though: e.g. $20! = 2432902008176640000$ permutations
to check.

#### Nearest neighbour tour

Another idea is to pick an arbitrary starting point, and keep moving to the
nearest untouched neighbour:

{{< mjx-block >}}
$p = p_0$
$i = 0$  
While there are still unvisited points:  
	$i = i+1$
	$p_i = closest\_unvisited\_neighbour(p)$
	Visit $p_i$
Go back to $p_0$ from $p_i$
{{< /mjx-block >}}

This produces a tour but there are simple examples where it produces wasteful
tours.

The main point is that it is a **greedy algorithm**, i.e. one that just looks
for the next best step from where it is. In general these are poor solutions if
there is no proof. The guideline is: **look for examples that make it wrong**.

Conclusion to this problem is that there is no correct and efficient algorithm
for it (it's the well known  [travelling salesman
problem](https://en.wikipedia.org/wiki/Traveling_salesman_problem)). It is **NP
complete**.

### Fast algorithms on slow computers

Point that fast algorithms always tend to outperform slow ones as the size
increases, regardless of the hardware.

### Maximum scheduling problem

How can we pick from a selection of overlapping scheduled slots to maximise the
time spent (e.g. from different jobs and we want to maximise the number of jobs
we take)?

{{< mjx-block >}}
Input: a set $I$ of $n$ intervals on a line  
Output: the largest subset of non-overlapping intervals from $I$
{{< /mjx-block >}}

One possible strategy is to keep selecting the interval that interferes with the
least others; produces a correct solution for the example given. Can we find an
example that makes it fail?

Ties are interesting when they're not the final choice, as you need to know how
picking either branch will affect subsequent choices down the chain. This is
actually why this approach is a **heuristic** and not a correct algorithm.
Again, focusing on examples that break it is how we can discover this.

#### First job to complete

Always take the job that ends first:

{{< mjx-block >}}
While $(I \neq \theta)$
	Take job $j$ with earliest completion date  
	(Remove any jobs conflicting with $j$)
{{< /mjx-block >}}

This is the optimal solution, and works in either direction (can go right-to-
left selecting earliest start dates).
