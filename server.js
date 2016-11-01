var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    path            = require('path'),
    mongoose        = require('mongoose'),
    models          = require('./models/index.js'),
    bcrypt          = require('bcrypt'),
    session         = require('client-sessions');


//configuration
var port = process.env.PORT || 3000;
mongoose.connect('mongodb://localhost/rewind-remind');
app.set('view engine', 'ejs');

//middleware
app.use(bodyParser());
app.use('/bower_components',express.static(path.join(__dirname+'/bower_components')));
app.use(session({
    cookieName: 'session',
    secret: 'some_long_random_string'
}));

//routes

//-------------GET REQUESTS--------------------
app.get('/', function(req, res) {
    res.render('index.ejs');
});

app.get('/login', function(req, res) {
    res.render('login.ejs');
});

app.get('/register', function(req, res) {
    res.render('register.ejs');
});

app.get('/dashboard', function(req, res) {
    res.render('dashboard.ejs');
});

//----------------POST REQUESTS--------------------
app.post('/register', function(req, res) {
    
    var userAuth = new models.auth({
        firstname:  req.body.firstname,
        lastname:   req.body.lastname,
        email:      req.body.email,
        password:   req.body.password
    });

    userAuth.save(function(err) {
        if(err) {
            var error = 'Sorry, some internal error has occurred.';
            
            if(err.code == 11000) {
                error = 'email has alread been taken, please try again.'
            }
            res.render('register.ejs', {error: error});
        } else {
            console.log('data has been saved');
            res.redirect('/dashboard');
        }
    });
});

app.post('/login', function(req, res) {

    models.auth.findOne({
        email: req.body.email
    }).then(function(user){

        if(!user) {
            res.render('login.ejs', {error: 'Incorrect email or password'});
        } else {
            if(user.password === req.body.password) {
                req.session.user = user.email;
                res.redirect('/dashboard');
            } else {
                res.render('login.ejs', {error: 'Incorrect email or password'});
            }
        }        
    }).catch(function(err) {
        res.render('login.ejs', {error: 'Internal Server Error'});
    });
});


app.listen(port, function() {
    console.log('Listening on port ' + port);
});