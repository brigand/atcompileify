var atcompile = require('atcompile');

atcompile.run(function(cb){
    var fs = require('fs');
    fs.readFile(__dirname + '/robot.html', cb, 'utf8')
}, function(err, result){
    console.log(result);
});