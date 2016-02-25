---
title: Validating URLs with the DOM
date: 2015-10-05
tech:
 - Javascript
 - DOM
---

URL validation is a common task in Web development, and thankfully a lot of
cases can now be handled by the browser with the [url input
type](http://www.w3.org/TR/html-markup/input.url.html):

{{< highlight html >}}
  <input type="url" name="gimme-a-link"></input>
{{< /highlight >}}

That's great and gives you a lot of functionality and good user experience on a
range of devices. However, a couple of issues remain once you've got your `url`
type input in place:

 - The browser's URL validation is fast and accurate, but can be too permissive.
 - Accessing the result of the validation is currently [a mixed-bag](https://
 developer.mozilla.org/en-US/docs/Web/API/ValidityState)
 across browsers.
 - You can't do fine-grained validation according to specific circumstances.

This leads to implementing your own front-end URL validation either to
complement or replace that provided by the browser. If you are rolling your own,
here's a request from me as a user: please keep the `url` type and add a
[novalidate attribute](http://www.w3.org/TR/html-
markup/form.html#form.attrs.novalidate) if you want to disable the browser's
validation -- this keeps the UX benefits which are particularly helpful on touch
devices.

The usual approach to custom validation is a regex (and perhaps asking an
[unwelcome question](http://meta.stackoverflow.com/questions/285733/should-give-
me-a-regex- that-does-x-questions-be-closed) on StackOverflow). Using regular
expressions to validate URLs is not as straightforward as you might expect:
here's [a fairly extensive comparison](https://mathiasbynens.be/demo/url-regex)
of different attempts to get it right. As you can see there, no individual regex
ticks all the boxes.

In any case, you probably don't want the perfect URL regex holy grail. For
example, the comparison linked to above includes
`http://userid:password@example.com` as a URL that should be accepted, but
chances are you don't want users submitting URLs containing usernames and
passwords. Then again, maybe you want to _require_ that they submit usernames
and passwords. The point is that no pattern is going to fit every situation.

Regular expressions are extremely satisfying to get right, which can lead
programmers to choose them over over options. Often, though, regexes aren't the
most maintainable piece of code in your project. Internally, they're about as
tightly coupled as it gets, and not particularly readable at a glance for other
developers (or yourself in six months' time).

So is there another option for parsing and validating URLs on the client-side?
There certainly is: let the browser do the parsing, and then do your validation
on the result of that. This approach is much more expressive, readable and
maintainable.

All you have to do is use an `a` element to get access to the browser's URL
parsing abilites:

{{< highlight javascript >}}
  parser = document.createElement('a');
  parser.href = 'https://www.example.com:80/page?q=foobar#section';
{{< /highlight >}}

Now you've got access to all these properties on the [parser
object](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement):

{{< highlight json >}}
{
  "hash": "#section",
  "host": "www.example.com:80",
  "hostname": "www.example.com",
  "href": "https://www.example.com:80/page?q=foobar#section",
  "origin": "https://www.example.com:80",
  "password": "",
  "pathname": "/page",
  "port": "80",
  "protocol": "https:",
  "search": "?q=foobar",
  "username": ""
}
{{< /highlight >}}

You can imagine how that allows you to write much more expressive validation
code about the URL.

There are some issues that need dealing with, though.

First up, because the DOM is providing a parser and not a validator as such,
it's going to do its best to determine a valid URL from whatever's given rather
than rejecting anything invalid. As we're dealing with a _href_ and not a URL,
this opens up a lot of valid inputs that we don't want to accept for a URL. For
example, an empty href will resolve to the current document location.

The first and most important fix is to require that the given URL includes a
protocol; this will prevent the DOM from interpreting it as a relative
reference:

{{< highlight javascript >}}
  function validateUrl(url) {
    if (!url || !/^https?:\/\//.test(url)) {
      return false;
    }

    ...
  }
{{< /highlight >}}

Note that the protocol requirement is being handled before we use the DOM to
parse the URL; otherwise, the DOM will use the protocol of the current location.

You might be surprised to see a regex being used there. Wasn't the goal to avoid
using regular expressions? Well, it's more that this approach allows you to
write much more semantically about your requirements for URLs being entered.
Regexes are still involved, but become much more readable.

Using this parser approach makes it easier to isolate the specific reasons for
rejection and provide better UX with more targeted validation messages. As well
as that, pull requests and peer reviews are much clearer when working with this
kind of parser object than with a regex. It's also easier to write and read
tests with this approach, as it's more straightforward to keep requirements
orthogonal and to build the functionality in steps in discrete tests.

This is all possible with regular expressions, but the DOM parser method is
simply clearer. You could use regexes to build your own parser, but that is
likely to be less accurate and less performant than the one offered by the
browser.

For example, it's now straightforward to require or reject the presence of
certain parts of the URL:

{{< highlight javascript >}}
  function validateUrl(url) {
    if (!url || !/^https?:\/\//.test(url)) {
      return false;
    }

    parser = document.createElement('a');
    parser.href = 'https://www.example.com:80/page?q=foobar#section';

    return
      // Reject URLs with username or password
      !parser.username && !parser.password
      // Require a dot then something other than
      // numbers and dots in the hostname
      && /\.[^0-9.]/.test(parser.hostname)
      // Disallow whitespace, starting with a dot
      // or ending with a dot in the hostname
      && !/(\s|^\.|\.$)/.test(parser.hostname)
  }
{{< /highlight >}}

As explained above, regexes are still used, but this approach means they can
stay very simple. In the real world, you'd probably precompile the regexes,
break out parts of the validation into separate functions and have a few other
requirements in there. That's all made straightforward because we have easy
access to the parsed URL.

This isn't a groundbreaking or complex technique (that's the point), but it is a
handy little tool for dealing expressively with URLs on the client side.
