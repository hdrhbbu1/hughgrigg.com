---
title: "Algorithm Design Exercise 1-28"
slug: algorithm-design-exercise-1-28
date: 2017-04-23
topics:
 - Learning
 - Computer Science
 - Algorithms
 - Data structures
 - Teach Yourself CS
---

This is exercise 1-28 from _The Algorithm Design Manual_.

 > Write a function to perform integer division without using either the / or *
   operators. Find a fast way to do it.

Let's add multiplication as well. We could do a very inefficient multiplication
algorithm by using one factor as a counter, and incrementing the other factor by
itself until the counter reaches its value:

{{< mjx-block >}}
$a \times b$
$i = 0$
$p = 0$
while $i < a$
	$p = p + b$
	$i = i + 1$
return $p$
{{< /mjx-block >}}

[Naive integer multiplication in Python](/code/adm/1/naive-multiplication.py)

```python
from sys import argv

def multiply(a, b):
	i = 0
	p = 0
	while i < a:
		p = p + b
		i = i + 1
	return p

print multiply(int(argv[1]), int(argv[2]))
```

Similar approach for integer division:

{{< mjx-block >}}
$a \div b$
$q = 0$
$s = 0$
while $s < a$
	$s = s + b$
	$q = q + 1$
return $q$
{{< /mjx-block >}}

[Naive integer division in Python](/code/adm/1/naive-division.py)

```python
from sys import argv

def divide(a, b):
	q = 0
	s = 0
	while s < a:
		s = s + b
		q = q + 1
	return q

print divide(int(argv[1]), int(argv[2]))
```

These have very poor time complexity, though, at $O(mn)$ where $m$ and $n$ are
the two numbers in each case.

It seems there's a faster way to do integer multiplication called the [Russian
peasant algorithm](http://www.geeksforgeeks.org/russian-peasant-multiply-two-
numbers-using-bitwise-operators/).

This works because $a \times b = (a \times 2) \times (b \div 2)$ when $b$ is
even, and that $+1$ when $b$ is odd.

E.g. $7 \times 6 = (7 \times 2) \times (6 \div 2) = 14 \times 3$. You can keep
applying that recursively, and that's the algorithm.

At first glance it looks like that still requires a multiplication operator to
do *2 and /2, but we can achieve the same with bitwise shifting, so:

{{< mjx-block >}}
$a \times b$
$p = 0$
while (b > 0)
  if (b & 1)
    $p = p + a$
  $a = a << 1$
  $b = b >> 1$
return p
{{< /mjx-block >}}

[Russian peasant multiplication in Go](/code/adm/1/russian-peasant-multiply.go)

```go
package main

import (
	"fmt"
	"os"
	"strconv"
)

func main() {
	a, _ := strconv.ParseInt(os.Args[1], 10, 64)
	b, _ := strconv.ParseInt(os.Args[2], 10, 64)
	fmt.Println(russianPeasant(a, b))
}

func russianPeasant(a int64, b int64) int64 {
	// Initialize the resulting product.
	var p int64 = 0
	for b > 0 {
		// Is the right hand number odd?
		if b%2 != 0 {
			p = p + a
		}
		// Double the left and halve the right.
		a = a << 1
		b = b >> 1
	}
	return p
}
```

Due to the halving of $b$, we know that it's going to be have complexity of
$O(log_2n)$, which is dramatically better then the naive algorithm above.

We can do something similar to get a $O(log_2n)$ solution for division without
using the division operator.

The idea is to start with an answer of one, and then keep doubling the answer
and the denominator until the denominator is higher than the numerator. At that
point we've gone one too far, so we halve them again to get back to the last
step. Then we know that the quotient is the highest factor of the denominator
that it can be without going over the right answer.

The last step is to recurse back into the algorithm with our updated denominator
and add that to the current answer we have. Eventually the recursion will return
a 0 (when the difference is not an integer, i.e. a fraction) or 1 (when we've
balanced the numerator and demoninator).

[Bitshifting integer division in Python](/code/adm/1/bitshift-divide.py)

```python
from sys import argv

def divide(numerator, denominator):
    if numerator == denominator:
        return 1

    if numerator < denominator:
        return 0

    original_denom = denominator
    quotient = 1
    
    while denominator <= numerator:
        denominator = denominator << 1
        quotient = quotient << 1
    
    denominator = denominator >> 1
    quotient = quotient >> 1
    
    return quotient + divide(numerator - denominator, original_denom)


print divide(int(argv[1]), int(argv[2]))
```

A demo might make this clearer. If we want to calculate $\frac{28}{9}$, the
steps would be:

1) Start with an answer of 1.

$\frac{28}{9} = 1?$

2) Keep doubling the answer and the denominator until the denominator is higher
than the numerator:

$\frac{28}{18} = 2?$

$\frac{28}{36} = 4?$

3) We know the answer is more than 2 but less than the 4 we got to, so we go
back one step by halving the answer and the denominator:

$\frac{28}{18} = 2?$

4) 2 is close but we need to add any spare 9s that we can fit in ($3 \times 9 =
27$ so we know we must be short). We do that by calculating
$2 + \frac{28 - 18}{9}$ with the same method:

$\frac{10}{9} = 1?$

$\frac{10}{18} = 2?$

$\frac{10}{9} = 1?$

So we've got a 1 to add. Can we squeeze out any more from $\frac{10 - 9}{9}$?
That's not an integer, so we just "add" 0 and come back out of the recursion
with $2 + 1 = 3$, which is the result of integer dividing 28 by 9.
