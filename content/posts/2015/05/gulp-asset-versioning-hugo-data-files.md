---
title: Using Gulp asset versioning with Hugo data files
slug: gulp-asset-versioning-hugo-data-files
date: 2015-05-23
tags:
 - programming
tech:
 - Gulp
 - Hugo
 - JavaScript
 - AWS
 - S3
 - CloudFront
---

I recently finished converting four of the websites I run from Wordpress to
[Hugo](http://gohugo.io/) (my [original blog](https://eastasiastudent.net/), a
[Chinese learning blog](http://www.chineseboost.com/blog/), a [Chinese grammar
site](https://www.chineseboost.com/grammar/) and this blog), and hosting them
with S3 and CloudFront.

It's been a great change to make and has improved everything from my workflow to
loading times and hosting costs. I'd recommend anyone running blogs and other
text-focused sites to switch away from Wordpress and use a static site generator
instead. Hugo would be my recommendation because of its efficiency and
flexibility, but there are many options.

One small issue I faced was asset versioning. As the sites are stored in S3 and
served from CloudFront with cache headers set to public, it often takes over 24
hours for changes to propagate. For typo fixes and content updates this is fine,
but it causes bigger problems when assets like CSS files get out of sync with
markup and make the site look bad.

Gulp plays a big part in my workflow (e.g. see [this
gulpfile](https://github.com/hughgrigg/chineseboost-
articles/blob/master/gulpfile.js)), and there's a Gulp module designed to solve
asset versioning problems: [gulp-rev](https://www.npmjs.com/package/gulp-rev).
That plugin uses a hashing function to add a unique prefix to asset filenames.
My gulp CSS task looks like this:

{{< highlight javascript >}}
gulp.task('style', function() {
  return gulp.src('./themes/chineseboost/scss/cba.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefix())
    .pipe(minifyCSS({
      'advanced': true,
      'aggressiveMerging': true,
      'keepBreaks': true
    }))
    .pipe(rev())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./themes/chineseboost/static/css'))
    .pipe(rev.manifest('rev_manifest.json'))
    .pipe(gulp.dest('./themes/chineseboost/data'));
});
{{< /highlight >}}

Adding the unique prefix is only part of the solution. You've also got to get
the uniquely named files into your markup. Hugo's [data
files](http://gohugo.io/extras/datafiles/) provide the perfect way to do this.
The feature lets you read data from files and use it in templates as the site is
being generated.

As shown above, the `gulp-rev` plugin writes a map of the original filename to
the versioned one as a JSON file. The contents will look like this:

{{< highlight json >}}
{
  "cba.css": "cba-36335a46.css"
}
{{< /highlight >}}

You simply need to get that written to the `data` directory in your Hugo project
and Hugo will make it available on `.Site.Data`. You can then write it into your
templates like this:

{{< highlight html >}}
<link rel="stylesheet"
  href='/css/{{ index .Site.Data.rev_manifest "cba.css" }}'
  type="text/css"
  property="stylesheet">
{{< /highlight >}}

This way, it's not possible for markup to come out of sync with styling as each
version of the CSS file has a specific name in whatever cache it is stored in.
It also has the advantage of ensuring that new pages will get the latest version
of the asset. With this set up, it's handled for you by Gulp and Hugo so you
don't have to think about it.
