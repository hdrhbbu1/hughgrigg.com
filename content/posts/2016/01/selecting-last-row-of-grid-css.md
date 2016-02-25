---
title: Selecting the last grid row in CSS
slug: css-select-last-grid-row
date: 2016-01-23
tech:
 - CSS
 - SCSS
---

Recently I had the need to select the last row of elements in a grid using CSS.
The selector needed to be able to handle an arbitrary total number of elements
in the grid; in other words, in a grid with <i>x</i> columns, there could be 0
to <i>x</i> elements in the last row.

With a fixed or predictable number of elements in the grid, this would be quite
straightforward. You can select on `:nth-last-child(-n+x)`, with <i>x</i> being
the known number of elements in the last row. If this was in a table, then you
could simply select `tr:last-child` to get the last row.

Similarly, selecting the first row of elements can be achieved quite directly
with `:nth-child(-n+x)`. This will select the first row of elements in a grid
with <i>x</i> columns, and it doesn't matter if there are not enough elements to
fill the first row.

Mozilla Developer Network has great explanations of the [:nth-
child](https://developer.mozilla.org/docs/Web/CSS/:nth-child) and [:nth-last-
child](https://developer.mozilla.org/docs/Web/CSS/:nth-last-child) pseudo
classes.

It only gets tricky when you want to select the last row of elements and there's
an arbitrary number of them.

The way to achieve it in CSS is (again where <i>x</i> is the number of columns):

1. Select every <i>x</i>th element to get the first element of each row.
2. Select the <i>x</i> last elements to limit that to the last row (you now have
   the first element of the last row).
3. Use a sibling selector to get the elements after that element (which is the
   rest of the last row).

If we're using an `ul` with a `li` for each element in the grid, then the above
looks like this. First select every <i>x</i>th element:

{{< highlight css >}}
li:nth-child(xn+1)
{{< /highlight >}}

Then limit that to the <i>x</i> last elements:

{{< highlight css >}}
li:nth-child(xn+1):nth-last-child(-n+x)
{{< /highlight >}}

Now we've got the first element of the last row. We also want to select siblings
of that to get the rest of the row (remember that the sibling selector only
applies to elements after the specified sibling):

{{< highlight css >}}
li:nth-child(xn+1):nth-last-child(-n+x),
li:nth-child(xn+1):nth-last-child(-n+x) ~
{{< /highlight >}}

Now we can style the elements in the last row however we want. In my case I
wanted to remove the margin underneath the last row to prevent extra spacing
below the grid (if you're using flexbox then you can probably avoid the need for
this with [align-content](https://css-tricks.com/almanac/properties/a/align-
content/)).

The rule needs specifying for each size of grid, so it might be useful as a SCSS
mixin:

{{< highlight scss >}}
@mixin last-grid-row($columns) {
    &:nth-child(#{$columns}n+1):nth-last-child(-n+#{$columns}),
    &:nth-child(#{$columns}n+1):nth-last-child(-n+#{$columns}) ~ {
        @content;
    }
}
{{< /highlight >}}
