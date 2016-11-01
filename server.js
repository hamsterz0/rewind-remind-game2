var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    path            = require('path'),
    mongoose        = require('mongoose'),
    models          = require('./models/index.js'),
    session         = require('client-sessions'),
    crypto          = require('crypto'),
    nodemailer      = require('nodemailer');
    


//configuration
var port = process.env.PORT || 3000;
var algorithm       = 'aes-256-ctr',
    password        = 'd6F3Efeq';;
mongoose.connect('mongodb://localhost/rewind-remind');
app.set('view engine', 'ejs');

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

//middleware
app.use(bodyParser());
app.use('/bower_components',express.static(path.join(__dirname+'/bower_components')));
app.use(session({
    cookieName: 'session',
    secret: 'some_long_random_string'
}));
app.use(function(req, res, next) {
    if(req.session && req.session.user) {
        
        models.auth.findOne({
            email: req.session.user
        }, function(err, user) {
            if(user) {
                req.user = user;
                console.log(req.user.email);
                delete req.user.password;
                req.session.user = req.user.email;
                res.locals.user = req.user;
            }
            next();
        });
    } else {
        next();
    }
});

function requireLogin(req, res, next) {
    console.log("------->" + req.user);
    if(!req.user) {
        res.redirect('/login');
    } else {
        next();
    }
}

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

app.get('/logout', function(req, res) {
    req.session.reset();
    res.redirect('/');
});

app.get('/dashboard', requireLogin, function(req, res) {
    res.render('dashboard.ejs');
});

app.get('/retrievepass', function(req, res) {
    res.render('retrievepass.ejs');
});

//----------------POST REQUESTS--------------------
app.post('/register', function(req, res) {

    req.body.password = encrypt(req.body.password);
    
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
            if(user.password === encrypt(req.body.password)) {
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

app.post('/retrievepass', function(req, res) {

    models.auth.findOne({
        email: req.body.email
    }).then(function(user) {
        if(user) {
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'labheracleia',
                    pass: 'blackcatpassillusion'
                }
            });
            var text = "Hello " + user.firstname + ", \n" + "Your password is: " + decrypt(user.password);
            var mailOptions = {
                from: 'thearnavgarg@gmail.com',
                to: user.email,
                subject: 'Lost Password',
                text: text
            };
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error);
                    res.send('Internel server error. Sorry for the inconvience');
                }else{
                    console.log('Message sent: ' + info.response);
                    res.send('Check your email');
                    // res.render('successful.ejs', {mssg: 'Check your email'});
                };
            });

        } else {
            render('retrievepass.ejs', {error: 'Invalid email'});
        }
    });

});


app.listen(port, function() {
    console.log('Listening on port ' + port);
});