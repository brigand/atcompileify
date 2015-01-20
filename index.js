var staticModule = require('static-module');
var quote = require('quote-stream');
var through = require('through2');
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var streams = require('stream');

var merge = function(dest, src) {
    Object.keys(src).forEach(function (key) {
        dest[key] = src[key];
    })
    return dest;
}

module.exports = function (file, opts) {
    if (/\.json$/.test(file)) return through();
    var vars = {
        __filename: file,
        __dirname: path.dirname(file)
    };
    if (!opts) opts = {};
    if (opts.vars) merge(vars, opts.vars);
    
    var sm = staticModule({
        atcompile: {
            run: run,
            runSync: runSync
        }
    }, { vars: vars });

    return sm;
    
    function run(runner, andThen){
        var src = '(' + runner.toString().trim() + ')(callback)';
        var stream = new streams.Readable();
        console.error(src);

        var done = false;
        var context = merge({}, vars);
        context = merge(context, {
            callback: function(err, result){
                if (err) {
                    return sm.emit('error', err);
                }

                stream.push(
                     '(function(cb){'
                    +'  process.nextTick(function(){'
                    +'    cb(null, ' + JSON.stringify(result) + ')'
                    +'  })'
                    +'})(' + andThen.toString() + ')'
                );
                stream.push(null);
                done = true;
            },
            console: console,
            process: process,
            require: function(x){
                // TODO: fix require
                return require(x);
            }
        });

        vm.runInNewContext(src, context);

        stream._read = function(){ if (!done) this.push(''); };
        return stream;
    }

    function runSync(runner) {
        var src = ''
            //+'(function(){\n'
            +'  try {\n'
            +'    callback(null, ('
            +'' + runner.toString().trim() + ''
            +')())\n'
            +'  }\n'
            +'  catch (e) {\n'
            +'    callback(e);\n'
            +'  } \n'
            //+'})()';
        var stream = new streams.Readable();

        var done = false;
        var context = merge({}, vars);
        context = merge(context, {
            callback: function(err, result){
                if (err) {
                    return sm.emit('error', err);
                }

                stream.push(JSON.stringify(result));
                stream.push(null);
                done = true;
            },
            console: console,
            process: process,
            require: function(x){
                return require(x);
            }
        });

        vm.runInNewContext(src, context);

        stream._read = function(){ if (!done) this.push(''); };
        return stream;
    }
};
