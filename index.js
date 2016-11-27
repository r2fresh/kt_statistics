var express = require('express');
var app = express();

app.get('/',function(req, res){
    res.sendFile(__dirname + '/index.html')
})

app.use(express.static('src'));

app.listen((process.env.PORT || 5000), function () {
    console.log('Example app listening on port 5000!');
});
