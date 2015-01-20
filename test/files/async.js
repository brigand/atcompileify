var atcompile = require('atcompile');
atcompile.run(function(cb){
    var fs = require('fs');
    fs.readFile(__dirname + '/async.txt', 'utf8', cb);    
}, function(err, text){
    console.log(text);
});
