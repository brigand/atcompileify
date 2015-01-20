var atcompile = require('atcompile');
atcompile.run(function(cb){
    var fs = require('fs');
    fs.readFile(__dirname + '/async.txt', {encoding: 'hex'}, cb);    
}, function(err, text){
    console.log(text);
});
