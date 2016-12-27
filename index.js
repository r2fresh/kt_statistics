var express = require('express');
var app = express();

var http = require('http')

app.get('/',function(req, res){
    res.sendFile(__dirname + '/src/index.html')
})

app.use(express.static('src'));

var getFunc = function(req, res) {
    
    var token = req.headers['x-auth-token'];

    // var http = require('http');
    // var options = {method: 'HEAD', host: '192.168.6.1', port: 8080, path: '/info/membership/daily/visit?from=2016-11-01&to=2016-11-30'};
    // var req = http.request(options, function(res) {
    //     console.log(JSON.stringify(res.headers));
    //   }
    // );
    // req.end();

    var options = {
        host: '192.168.6.1',
        port: 8080,
        path: req._parsedUrl.path,
        method: 'GET',
        headers: {
            accept: 'application/json',
            'x-auth-token' : token
        }
    };
    var x = http.request(options,function(ress){
        var body = '';
        ress.on('data',function(d){
            body += d;
        });
        ress.on('end', function() {
            console.log(body)
            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
            res.send(parsed)
        });
    });

    x.end();


    //
    // var token = req.headers['x-auth-token'];
    //
    // var options = {
    //   host: '192.168.6.1',
    //   path: '/info/membership/daily/visit?from=2016-11-01&to=2016-11-30',
    //   port: '8080',
    //   //This is the only line that is new. `headers` is an object with the headers to request
    //   headers: {'x-auth-token': token}
    // };
    //
    // callback = function(response) {
    //   console.log(response)
    // }
    //
    // var reqs = http.request(options, callback);
    //
    //
    // http.get({
    //     host: '192.168.6.1',
    //     path: '/info/membership/daily/visit?from=2016-11-01&to=2016-11-30'
    //     port: '8080'
    //     headers: {'x-auth-token': token}
    // }, function(response) {
    //     console.log(response)
    //     // Continuously update stream with data
    //     // var body = '';
    //     // response.on('data', function(d) {
    //     //     body += d;
    //     // });
    //     // response.on('end', function() {
    //     //
    //     //     // Data reception is done, do whatever with it!
    //     //     var parsed = JSON.parse(body);
    //     //     callback({
    //     //         email: parsed.email,
    //     //         password: parsed.pass
    //     //     });
    //     // });
    // });
}

app.get('/info/membership/daily/visit', getFunc)
app.get('/info/membership/hourly/visit', getFunc)
app.get('/info/membership/monthly/visit', getFunc)
app.get('/info/membership/menu', getFunc)


app.listen((process.env.PORT || 5000), function () {
    console.log('Example app listening on port 5000!');
});
