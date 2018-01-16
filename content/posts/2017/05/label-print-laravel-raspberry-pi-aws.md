---
title: Auto-printing shipping labels with Laravel, Raspberry Pi and AWS
slug: label-print-laravel-raspberry-pi-aws
date: 2017-05-29
author: Hugh Grigg
tech:
 - AWS
 - Laravel
 - PHP
 - PHP7
 - Python
 - Raspberry Pi
 - SQS
---

The most manual part of the e-commerce [side project](http://localhost:1313/work
/poprobincards/) I run with my wife is shipping the orders. We get order
notifications by [email and Telegram](https://github.com/hughgrigg/poprobincards/bl
ob/a08850cbee203223db309965b6e264e7e951e693/app/Modules/Sales/Notifications/Staf
fOrderNotification.php#L52), and have to:

 1. Find the stock.
 2. Package it.
 3. Print the shipping label, cut out and attach it.
 4. Take the order to the post box.

A lot of that is beyond our means to automate, but we did get a [Brother
QL-570](https://www.brother.co.uk/labelling/ql-printers/ql570) label printer to
speed up step 3 quite a lot. That prints and cuts adhesive labels that look
more professional than what we were doing before, and costs less per label.

The next idea was to automate the printing of the shipping labels, so that
the printer kicks in each time there is a new order without us having to do
anything else.

## Getting print jobs on a queue

The first step was getting a queue for shipping label print jobs. A queue seemed
like a natural way to set this up, as it de-couples the printing from the server
managing the ordering system, both in implementation and in timing.

Laravel has a great [queue abstraction](https://laravel.com/docs/5.4/queues)
that made it easy to use a Beanstalkd queue on the local development server and
an SQS queue in production. That combines nicely with Laravel's asynchronous
queued events, letting us drop a [print job](https://github.com/hughgrigg/ching-
shop/blob/master/app/Modules/Sales/Jobs/PrintOrderAddress.php) on to the queue
for each new order.

We also added a print button to trigger the printing of the address for a
particular order, and a generic printing form that allows printing of any
address, which is useful for eBay orders.

This set up was also [quite easy to test](https://github.com/hughgrigg/ching-sho
p/blob/a08850cbee203223db309965b6e264e7e951e693/tests/Functional/Staff/Sales/Ord
erNotificationTest.php#L46-L46) in Laravel, giving us confidence that the
implementation hadn't broken anything else in the ordering system, and that it
would queue up the jobs correctly in production.

## Consuming print jobs

A small [Python script](https://github.com/hughgrigg/poprobincards/blob/8d862db7ad1
a5bb48dbdfbf03e6b1516189b720c/infrastructure/printing/printer.py) listens for
print jobs on either Beanstalkd or SQS.

This made it easy to do trial runs with the local development server. The only
tricky thing was making the Beanstalkd queue available to a process outside
the Vagrant box, which turned out to require an SSH tunnel. 

## Communicating with the label printer

To print out the jobs on the label printer, we're using a Raspberry Pi to listen
to the print queue and send them to the label printer. This runs Ubuntu Mate and
uses the Python script above to consume jobs and print them.

The communication with the Brother label printer takes a few steps.

First a search and replace is done on an [SVG template
file](https://github.com/hughgrigg/ching-
shop/blob/d1ad60608cfe41cb7b7318bfee73eec9bc879cd1/infrastructure/printing
/address-label-template.svg#L1-L1) to get a representation of the address label.

That SVG is then rendered to a bitmap, as that's the format required by the
[Brother printer command](https://github.com/pklaus/brother_ql) to send to the
printer.

It turned out to be too much hassle to use the printing package directly in
code, as it's designed for command line use. In the end it was more pragmatic to
just make shell commands to it from the Python script. These commands first
convert the bitmap into the format for the printer, and then send that over the
cable to the printer on `/dev/usb/lp0`.

The final step was to have monit start the printer script on the Raspberry Pi
and keep it running.

## Fun order notifications

With this working, the shipping labels collect underneath the printer ready to
be stuck on to the packaged orders. A nice side-effect is that if we're in the
room when an order comes in, we get a fun order notification in the form of the
shipping label getting printed and cut by the label printer.
