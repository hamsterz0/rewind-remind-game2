var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    path            = require('path'),
    mongoose        = require('mongoose'),
    models          = require('./models/index.js'),
    session         = require('client-sessions'),
    crypto          = require('crypto'),
    nodemailer      = require('nodemailer'),
    UAParser        = require('ua-parser-js');

//configuration
var port = process.env.PORT || 3000;
var algorithm       = 'aes-256-ctr',
    password        = 'd6F3Efeq';

mongoose.connect('mongodb://heracleians:blackcatpassillusion1@ds149069.mlab.com:49069/rewind-remind');
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

app.use(bodyParser());
app.use('/bower_components',express.static(path.join(__dirname+'/bower_components')));
app.use('/assets',express.static(path.join(__dirname+'/assets')));

app.use(session({
    cookieName: 'session',
    secret: 'some_long_random_string',
    duration: 24 * 60 * 60 * 1000,
    activeDuration: 1000 * 60 * 5
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
                    next();

                });
            }
            
        });
    } else {
        next();
    }
});

function completionEmail(req, res, next) {

    if(req.user.current == 41) {
        if(req.user.completionEmail === false) {


            models.auth.update({_id: req.user._id}, {
                $set: {
                    completionEmail: true
                }
            }, function(err, result) {
                var rEmail1 = 'thearnavgarg@gmail.com';

                var emails = req.user.email + ', '+ rEmail1; 

                var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'labheracleia',
                        pass: 'blackcatpassillusion'
                    }
                });
                var text = "Hello " + req.user.firstname + ", \n" + "Thank you for completing the game";
                var mailOptions = {
                    from: 'Heracleia Lab',
                    to: emails,
                    subject: 'Thank you for completing the Rewind-Remind Game',
                    text: text
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log(error);
                    }else{
                        console.log('Message sent: ' + info.response);
                        // res.render('successful.ejs', {mssg: 'Check your email'});
                    };
                });
                next();
            });
        }
    }
    next();
}


function controlgroupusers(req, res, next) {

    if(req.user.stype[0] == 'C') {
        next();
    } else {
        res.redirect('/dashboard');
    }
}

function requireLogin(req, res, next) {
    if(!req.user) {
        res.redirect('/login');
    } else {
        next();
    }
}

function redirectToDashboard(req, res, next) {
    if(req.session && req.session.user) {
        res.redirect('/dashboard');
    } else {
        next();
    }
}

function gameCurrentStage(req, res, next) {

    if(req.params.id > req.user.current) {
        res.redirect('/game/memorize/' + req.user.current);
    }

    next();
}

function gameCurrentStage4CG(req, res, next) {

    if(req.params.id > req.user.current) {
        res.redirect('/game/testuser/' + req.user.current);
    }

    next();
}

function practiceRoundValid(req, res, next) {

}

function practiceRoundValid4CG(req, res, next) {

}

//                          ROUTES



/*

    GET REQUESTS


*/




app.get('/', function(req, res) {
    res.redirect('/welcome');
});

app.get('/welcome', function(req, res) {
    res.render('index.ejs');
});

app.get('/login', redirectToDashboard, function(req, res) {
    res.render('login.ejs');
});

app.get('/register', function(req, res) {
    res.render('register.ejs');
});

app.get('/logout', function(req, res) {
    req.session.reset();
    res.redirect('/');
});

app.get('/dashboard', requireLogin, completionEmail, function(req, res) {
    console.log('coming here from /game/test');
    res.render('dashboard.ejs');
});

app.get('/retrievepass', function(req, res) {
    res.render('retrievepass.ejs');
});

app.get('/game/memorize/:id', requireLogin, gameCurrentStage, function(req, res) {
    res.render('game.ejs', {wg: req.params.id});
});

app.get('/game/test/:id', requireLogin, function(req, res) {

    res.render('gametest.ejs', {wg: req.params.id});
});


app.get('/game/cgtest/:id', requireLogin, controlgroupusers, gameCurrentStage4CG, function(req, res) {
    
    res.render('cg_gametest.ejs', {wg: req.params.id});
});



app.get('/game/getwords', requireLogin, gameCurrentStage, function(req, res) {

    var current = req.query.usercurrent;

    var week = 'w' + current[0];
    var game = 'g' + current[1];

    models.words.find({}, {memorizewords:1, _id: 0}).then(function success(response) {

        
        var words = response[0].memorizewords;
        var userwords = words[week][game]

        return res.json(userwords);
    }).catch(function(err) {

    });

});

app.get('/game/gettestwords', requireLogin, function(req, res) {

    var current = req.query.usercurrent;

    if(current === 1000) {
        return res.json(words);
    }

    var week = 'w' + current[0];
    var game = 'g' + current[1];

    models.words.find({}, {testwords:1, _id: 0}).then(function success(response) {

        
        var words = response[0].testwords;
        var userwords = words[week][game]

        return res.json(userwords);
    }).catch(function(err) {
        
    });
});



app.get('/game/results', requireLogin, function(req, res) {

    models.playerdata.findOne({
        userID: req.user._id
    }).then(function(data) {

        return res.json(data);
    });
});

app.get('/game/practiceround', requireLogin, function(req, res) {

    res.render('practiceround.ejs', {wg: req.params.id});
});

app.get('/game/practicetest', requireLogin, function(req, res) {

    res.render('practicetest.ejs', {wg: req.params.id});
})

app.get('/game/getpracticewords', requireLogin, function(req, res) {

    models.words.find({}, {memorizewords:1, _id:0}).then(function success(response) {

        var words = response[0].memorizewords;
        var userwords = words.practiceRound;

        return res.json(userwords);

    }).catch(function(err) {

    });
});

app.get('/game/getpracticetestwords', requireLogin, function(req, res) {

    models.words.find({}, {testwords:1, _id: 0}).then(function success(response) {

        
        var words = response[0].testwords;
        var userwords = words.practiceRound;

        return res.json(userwords);
    }).catch(function(err) {
        
    });
});

app.get('/game/cgpracticeround', function(req, res) {

    res.render('cg_practiceround.ejs', {wg: req.params.id});
});


/*


        POST REQUESTS



*/




app.post('/register', function(req, res) {

    models.stype.findOne({
        key: 'secret_key'
    }).then(function(data) {
        var age = req.body.age;


        if(age > 50) {

            if(data.SGEO <= data.DEO && data.CGO == data.DEO) {
            req.body.stype = 'SGE';
            data.SGE += 1;
            data.SGEO += 1;
            } else if(data.DEO <= data.CGO) {
                req.body.stype = 'DE';
                data.DE += 1;
                data.DEO += 1;
            } else {
                req.body.stype = 'CG';
                data.CG += 1;
                data.CGO += 1;
            }
        } else {
            if(data.SGEY <= data.DEY && data.CGY == data.DEY) {
            req.body.stype = 'SGE';
            data.SGE += 1;
            data.SGEY += 1;
            } else if(data.DEY <= data.CGY) {
                req.body.stype = 'DE';
                data.DE += 1;
                data.DEY += 1;
            } else {
                req.body.stype = 'CG';
                data.CG += 1;
                data.CGY += 1;
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
                DEO:    data.DEO,
                CG:     data.CG,
                CGY:    data.CGY,
                CGO:    data.CGO
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
                        error = 'email has already been taken, please try again.'
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

app.post('/game/end', function(req, res) {

    console.log(req.user._id);


    models.playerdata.findOne({
        userID: req.user._id
    }).then(function(userplayerdata) {

        var current = req.user.current.toString();
        var week = 'week' + current[0];
        var game = 'game' + current[1];

        userplayerdata.gameresults[week][game].questionTime = req.body.userresult.questionTime;
        userplayerdata.gameresults[week][game].hint = req.body.userresult.hint;
        userplayerdata.gameresults[week][game].correctAnswers = req.body.userresult.correctAnswers;

        models.playerdata.update({userID: req.user._id}, {
            $set: {
                gameresults: userplayerdata.gameresults
            }
        }, function(err, result) {

            models.auth.update({_id: req.user._id}, {
                $set: {
                    current: req.body.usercurrent,
                    practiceComplete: true
                }
            }, function(err, result) {


                res.redirect('/dashboard');    
            });
        });

    }).catch(function(err) {
        console.log('ERROR IN GAME END: ' + err);
    });

});

app.post('/game/storingphrases', function(req, res) {

     models.playerdata.findOne({
        userID: req.user._id
    }).then(function(userplayerdata) {

        var current = req.body.usercurrent.toString();
        var week = 'week' + current[0];
        var game = 'game' + current[1];

        userplayerdata.gameresults[week][game].phrases = req.body.phrases;

        models.playerdata.update({userID: req.user._id}, {
            $set: {
                gameresults: userplayerdata.gameresults
            }
        }, function(err, result) {

            res.redirect('/game/test/' + req.body.usercurrent);
        });

    }).catch(function(err) {
        console.log('ERROR IN GAME END: ' + err);
    });
})

app.post('/game/practiceend', function(req, res) {

    models.auth.update({
        email: req.user.email
    }, {
        $set: {
            practiceComplete: true
        }
    }, function(err, result) {

        console.log(result);
        res.redirect('/dashboard');
    })
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
            var text = "Hello " + user.firstname + ", \nThe password to your account is provided below.\n" + 
                   "For any further questions, please contact Arnav Garg at arnav.garg@mavs.uta.edu\n\n" + "Your password is: " + decrypt(user.password);
            var mailOptions = {
                from: 'thearnavgarg@gmail.com',
                to: user.email,
                subject: 'Lost Password [PASSWORD MADE VISIBLE IN PLAIN TEXT]',
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

app.post('/game/test', function(req, res) {

    if(req.body.valid != 1) {
        console.log('redirecting...');
        return res.json({ redirect: '/dashboard' })
    } else {
        return res.json({ redirect: '/game/test' })
    }

});

app.post('/practiceComplete', function(req, res) {

    models.auth.update({_id: req.user._id}, {
        $set: {
            practiceRound: true
        }
    }, function(err, result) {
        
        res.redirect('/dashboard');

    });

    res.redirect('/dashboard');
});

app.listen(port,function() {   
    console.log('Listening on port ' + port);
});