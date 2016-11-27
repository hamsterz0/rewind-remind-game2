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
app.use('/assets',express.static(path.join(__dirname+'/assets')));
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

                models.playerdata.findOne({
                    
                    userID: user._id

                }, function(err, playerdata) {

                    if(playerdata) {
                        req.playerdata = playerdata;
                        req.session.playerdata = req.playerdata;
                        res.locals.playerdata = req.playerdata;
                        req.user = user;
                        delete req.user.password;
                        req.session.user = req.user.email;
                        res.locals.user = req.user;
                    }
                    res.app.locals.week1 = 'Hello';
                    next();

                });
            }
            
        });
    } else {
        next();
    }
});

function requireLogin(req, res, next) {
    if(!req.user) {
        res.redirect('/login');
    } else {
        next();
    }
}

//routes

//-------------GET REQUESTS--------------------
app.get('/', function(req, res) {
    res.redirect('/welcome');
});

app.get('/welcome', function(req, res) {
    req.session.reset();
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
app.get('/game', function(req, res) {
    res.render('game.ejs');
});

app.get('/getwords', requireLogin, function(req, res) {

    var words = {
        userinfo : req.user.firstname,
        week1: {
            word1 : 'word1answer',
            word2 : 'word2'
        }
        
    }

    return res.json(words);
});

//----------------POST REQUESTS--------------------
app.post('/register', function(req, res) {

    models.stype.findOne({
        key: 'secret_key'
    }).then(function(data) {
        var age = req.body.age;

        if(data.DE > data.SGE) {
            req.body.stype = 'SGE';
            data.SGE += 1;
            if(age > 50) {
                data.SGEO += 1;
            } else {
                data.SGEY += 1;
            }
        } else if(data.SGE > data.DE){
            req.body.stype = 'DE';
            data.DE += 1;
            if(age > 50) {
                data.DEO += 1;
            } else {
                data.DEY += 1;
            }
        } else {
            if(age < 50) {
                if(data.DEY >= data.SGEY) {
                    req.body.stype = 'SGE';
                    data.SGEY += 1;
                    data.SGE += 1;
                } else {
                    req.body.stype = 'DE';
                    data.DE += 1;
                    data.DEY += 1;
                }
            } else {
                 if(data.DEO >= data.SGEO) {
                    req.body.stype = 'SGE';
                    data.SGEO += 1;
                    data.SGE += 1;
                } else {
                    req.body.stype = 'DE';
                    data.DE += 1;
                    data.DEO += 1;
                }
            }
        }

        models.stype.update({_id: data._id}, {
            $set: {
                key:    data.key,
                SGE:    data.SGE,
                SGEY:   data.SGEY,
                SGEO:   data.SGEO,
                DE:     data.DE,
                DEY:    data.DEY,
                DEO:    data.DEO
            }
        }, function(err, result) {

            req.body.password = encrypt(req.body.password);
    
            var userAuth = new models.auth({
                firstname:  req.body.firstname,
                lastname:   req.body.lastname,
                email:      req.body.email,
                password:   req.body.password,
                stype:      req.body.stype,
                age:        req.body.age
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
                    
                    var playerDataInit = new models.playerdata({
                        userID: userAuth._id
                    });

                    playerDataInit.save(function(err) {
                        if(err) {
                            res.render('register.ejs', {error: 'Sorry, some internal error has occured.'});
                        }
                        res.redirect('/dashboard');
                    });
                }
            });       
        });
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
                    res.render('retrievepass.ejs', {error: 'Internal Server Error. Sorry for the inconvience.'});
                }else{
                    console.log('Message sent: ' + info.response);
                    res.render('retrievepass.ejs', {error: 'Check Email'});
                    // res.render('successful.ejs', {mssg: 'Check your email'});
                };
            });

        } else {
            res.render('retrievepass.ejs', {error: 'Invalid email'});
        }
    });

});


app.listen(port, function() {
    console.log('Listening on port ' + port);
});