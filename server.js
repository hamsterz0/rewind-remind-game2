var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');


//configuration
var port = process.env.PORT || 3000;

//middleware
app.use(bodyParser());


//routes
app.get('/', function(req, res) {
    res.render('index.ejs');
});

app.post('/', function(req, res) {
    
    var randomValue = req.body.data;
    console.log(randomValue);
});

app.listen(port, function() {
    console.log('Listening on port ' + port);
});