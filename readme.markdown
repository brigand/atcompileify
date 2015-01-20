# atcompileify

fs.readFileSync() and fs.readFile() static asset browserify transform

[![build status](https://secure.travis-ci.org/brigand/atcompileify.png)](http://travis-ci.org/brigand/atcompileify)

This module is a plugin for [browserify](http://browserify.org) that lets you run any expression at compile time,
and get the result in your bundle.  If you use it directly in node, it runs the expression at load time, without compiling.

This allows you to interact with the file system, or make build time network requests, without individual transforms for each.  Commonly used transforms like atcompileify,
envify, and more, can be replaced with this.

This is a slightly modified version of atcompileify's intro example.  The atcompileify repo is a fork of [substack/atcompileify](https://github.com/substack/atcompileify).

```js
var atcompile = require('atcompile');
var html = atcompile.runSync(function(){
    var fs = require('fs');
    return fs.readFileSync(__dirname + '/robot.html', 'utf8')
});
console.log(html);
```

and a robot.html:

``` html
<b>beep boop</b>
```

first `npm install --save-dev atcompileify` into your project, then:

## on the command-line

```
$ browserify -t atcompileify example/main.js > bundle.js
```

which turns your code into:

``` js
var html = "<b>beep boop</b>\n";
console.log(html);
```

## or with the api

``` js
var browserify = require('browserify');
var fs = require('fs');

var b = browserify('example/main.js');
b.transform('atcompileify');

b.bundle().pipe(fs.createWriteStream('bundle.js'));
```

## async

You can also use, for example, `fs.readFile()`:

``` js
var atcompile = require('atcompile');

atcompile.run(function(cb){
    var fs = require('fs');
    fs.readFile(__dirname + '/robot.html', cb, 'utf8')
}, function(err, result){
    console.log(result);
});
```

When you run this code through atcompileify, it turns into:

``` js
var fs = require('fs');
process.nextTick(function() {function (err, result) {
    console.log(result);
})(null, "<b>beep boop</b>\n")});
```

# methods

# usage

A tiny command-line program ships with this module to make debugging easier.

```
usage:

  atcompileify file
 
    Runs the transform `file`, printing the transformed file
    contents to stdout.

  atcompileify
  atcompileify -
 
    Runs the transform on the code from stdin, printing the transformed file
    contents to stdout.

```

# install

With [npm](https://npmjs.org) do:

```
npm install atcompileify
```

then use `-t atcompileify` with the browserify command or use `.transform('atcompileify')` from
the browserify api.

# license

MIT

# credit

Original work on [brfs](https://github.com/substack/brfs) done by [substack](https://github.com/substack).
brfs is great, but I want a more general solution.
