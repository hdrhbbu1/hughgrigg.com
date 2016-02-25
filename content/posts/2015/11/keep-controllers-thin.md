---
title: Keep controllers thin
slug: keep-controllers-thin
date: 2015-11-23
tech:
 - MVC
 - OOP
 - design patterns
 - HTTP
---

The world of professional web development is dominated by the [MVC
pattern](http://c2.com/cgi/wiki?ModelViewController). MVC is so common in
object oriented web development that it seems fundamental: _of course_ your
app has models, views and controllers (although other approaches could be
perfectly valid).

One bit of advice that tends to get passed around for implementing with
the MVC pattern is "thin controllers and fat models", or some  variation of
that. I think this maxim misses the point.

It certainly is a good idea to keep your controllers thin. In a web app, the
controllers should be concerned with HTTP verbs, and very little else. By that
I mean that a controller's responsibility should be focused on web requests:
it sits as a thin layer between the web and the application.

There shouldn't be any business logic in a controller. It's a co-ordinator,
not a do-er. One way of thinking about this that I find helpful is to consider
a command line interface for the same user interaction your web controller
is handling. The CLI would interact with the application from a different
entry point, so if you've got business logic in the web controller, you'd
have to duplicate it in the CLI implementation. Clearly that business logic
(or any non-web logic) should go somewhere else, so that it's not tied to
the way in which the user is interacting with the application.

A related point is that each public controller method should deal with
one specific type of web request. Sometimes I see controller methods that
handle both the GET and POST requests for a web form, or, even worse, several
separate but related types of request. This nearly always leads to spaghetti
code, and is easily avoided by separating out the separate concerns into
separate methods.

Similarly, things like the request or response format should also be kept
separate. What the user wants to do should be orthogonal to how they make
the request and how they want the response to look. Again, considering or
actually implementing a CLI interface makes it clear why this should all be
separate and not tied together. The same is true of an API that accepts and
responds with JSON or XML. In short: separate all the things.

That covers why thin controllers are a good thing, so why don't I agree with
"thin controllers, fat models"?

Because the models should be thin, too.

Moving tightly coupled implentation details from the controller to the model
is a tiny bit better, but not a lot. It's going to lead to messy code. One
might be bolognese and the other carbonara, but it's all spaghetti.

I think most people learning MVC (myself included) go through a phase of
believing that model, view and controller are the types of classes your web
application should have, and everything has to go into one of them. There
are a lot of questions online asking about which letter of MVC should contain
the bit of logic the asker wants to implement.

This is related to [fear of adding
classes](http://c2.com/cgi/wiki?FearOfAddingClasses), and is damaging to
the design of an application. There should be as many classes as you need
to separate out concerns. It is possible to go too far with this, but the
far more common problem is god or demi-god classes (or even single methods)
that have far too many responsibilities and far too much logic.

In the c2wiki article linked to above, the explanation of the M in MVC is:

Todo quote: "A model is an object representing data or even activity, e.g. a
database table or even some plant-floor production-machine process."

That's actually quite broad. In one breath that covers database storage,
retrieval, user actions, ongoing processes and other things. Those concerns
should all be separated out, and it doesn't matter if you call the resulting
classes "models" or not.

A common perception is that the model in MVC is for database work, usually
with an ORM. That's fine, so long as that's all it does. It's reasonable to
split out more classes like presenters, repositories, processes, actions or
whatever around that.

It also doesn't matter whether the resulting classes are a certified and
approved "design pattern" or not. If an established design pattern helps
you keep things clear and separate, then great. But if a solution doesn't
appear in the literature, it doesn't mean it's bad. So long as it keeps
things orthogonal, the next person to work on the code will thank you for it.

A random selection of classes you might use to break out logic from an MVC
controller could include:

 - Middlewares / decorators that can be chained independently of each other and
 re-used
 - Request classes specific to particular requests (more specific than
 just POST or PUT, e.g. a class that represents the submission of a particular
 form)
 - The same for responses
 - Validation classes, again specialised to particular commands or actions
 - Redirection and routing classes

And so on; there are many more. None of this is ground-breaking, and that's
the point. There is no shortage of ways to keep all classes in an application
lean and specialised, including  controller classes.
