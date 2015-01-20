var atcompile = require('atcompile');
var pre = atcompile.runSync(function(){
    var fs = require('fs');
    return fs.readFileSync(__dirname + '/ag_pre.html', 'utf8')
});
var post = atcompile.runSync(function(){
    var fs = require('fs');
    return fs.readFileSync(__dirname + '/ag_post.html', 'utf8')
});
var ag = require('./ag.json');
console.log(pre + Object.keys(ag).sort().join('') + post);
