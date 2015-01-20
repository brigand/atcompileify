var atcompile = require('atcompile');
var html = atcompile.runSync(function(){
    var fs = require('fs');
    return fs.readFileSync(__dirname + '/robot.html', 'utf8')
});
console.log(html);