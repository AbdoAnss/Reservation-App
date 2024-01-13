const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {promisify} = require("util");



const db = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE
})


exports.register = (req, res) => {
    console.log(req.body);
    // destructure req.body
    const {signupusername, signupemail, signuppassword, confirmpassword} = req.body;
    

    db.query('SELECT email FROM users WHERE email = ?', [signupemail], async (error, results) => {
        if(error){
            console.log(error);
        }
        if(results.length > 0){
            return res.render('register', {
                message: 'That email is already in use'
            })
        } else if(signuppassword !== confirmpassword){
            return res.render('register', {
                message: 'Passwords do not match'
            })
        } else if(signuppassword.length < 8){
            return res.render('register', {
                message: 'Password must be at least 8 characters long'
            })
         
            
        }
        


            let hashedPassword = await bcrypt.hash(signuppassword, 8);
            console.log(hashedPassword);

            db.query('INSERT INTO users SET ?', {username: signupusername, email: signupemail, password: hashedPassword}, (error, results) => {
                if(error){
                    console.log(error);
                } else {
                    console.log(results);
                    return res.render('register', {
                        success: 'User registered'
                    });
                }
            })

        
        
    });


    
};

exports.login = async (req, res) => {
    try {
        const {loginusername, loginpassword} = req.body;

        if(!loginusername || !loginpassword){
            return res.status(400).render('register', {
                message: 'Please provide an email and password'
            })
        }

        db.query('SELECT * FROM users WHERE username = ?', [loginusername], async (error, results) => {
            console.log(results);
            if(!results || !(await bcrypt.compare(loginpassword, results[0].password))){
                res.status(401).render('register', {
                    message: 'Email or password is incorrect'
                })
            } else {

                const id = results[0].id;
                const token = jwt.sign({id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                
                console.log("The token is: " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES *24 *60 *60 *1000
                    ),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/dashboard");
            }
        })

    } catch (error) {
        console.log(error);
    }
}

exports.isLoggedIn = async (req, res, next) => {
    // console.log(req.cookies);
    if( req.cookies.jwt) {
      try {
        //1) verify the token
        const decoded = await promisify(jwt.verify)(req.cookies.jwt,
        process.env.JWT_SECRET
        );
  
        console.log(decoded);
  
        //2) Check if the user still exists
        db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, result) => {
          
          console.log(result);
  
          if(!result) {
            return next();
          }
  
          req.user = result[0];
          console.log("user is")
          console.log(req.user);
          return next();
  
        });
      } catch (error) {
        console.log(error);
        return next();
      }
    } else {
      next();
    }
  }

exports.reserv = (req, res) => {
    if (req.cookies.jwt) {
        jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (error, decoded) => {
            if (error) {
                console.log(error);
                // Handle the error, e.g., redirect to login page
                return res.redirect('/login');
            }

            const { reservname, date, time, guests } = req.body;
            console.log(req.body);

            db.query('INSERT INTO reservations SET ?', { name: reservname,date: date, time:time, guests:guests, userID: decoded.id }, (error, results) => {
                if (error) {
                    console.log(error);
                    // Handle the error, e.g., render an error page
                    return res.render('dashboard', { error: 'Error making reservation' });
                } else {
                    console.log(results);
                    return res.render('dashboard', {
                        success: 'Reservation made'
                    });
                }
            });
        });
    } else {
        // Handle the case where there is no JWT cookie, e.g., redirect to login page
        res.redirect('/login');
    }
};

exports.modifyUser = async (req, res) => {
    if (req.cookies.jwt) {
        jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (error, decoded) => {
            if (error) {
                console.log(error);
                // Handle the error, e.g., redirect to login page
                return res.redirect('/login');
            }

            const { username, email, password, passwordConfirmation, profileimg } = req.body;
            console.log(req.body);
            if (password !== passwordConfirmation) {
                return res.render('settings', {
                    error: 'Passwords do not match'
                })
            } else if (password.length < 8) {
                return res.render('settings', {
                    error: 'Password must be at least 8 characters long'
                })
            }

            let hashedPassword = bcrypt.hash(password, 8);
            console.log(hashedPassword);


            db.query('UPDATE users SET username = ?, email = ?, password = ?, img = ? WHERE id = ?', [username, email, hashedPassword, profileimg, decoded.id], (error, results) => {
                if (error) {
                    console.log(error);
                    // Handle the error, e.g., render an error page
                    return res.render('settings', { error: 'Error updating user' });
                } else {
                    console.log(results);
                    return res.render('settings', {
                            sucess: 'User updated'
                        })
                }
            }
            );
        });
    } else {
        // Handle the case where there is no JWT cookie, e.g., redirect to login page
        res.redirect('/login');
    }
};








exports.userReservations = (req, res) => {
    if (req.cookies.jwt) {
        jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (error, decoded) => {
            if (error) {
                console.log(error);
                // Handle the error, e.g., redirect to login page
                return res.redirect('/login');
            }

            db.query('SELECT * FROM reservations WHERE userID = ?', [decoded.id], (error, results) => {
                if (error) {
                    console.log(error);
                    // Handle the error, e.g., render an error page
                    return res.render('error', { error: 'Error getting reservations' });
                } else {
                    console.log(results);
                    return res.render('reserv', {
                        reservations: results
                    });
                }
            });
        });
    } else {
        // Handle the case where there is no JWT cookie, e.g., redirect to login page
        res.redirect('/login');
    }
};

exports.deleteReservation = (req, res) => {
    if (req.cookies.jwt) {
        jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (error, decoded) => {
            if (error) {
                console.log(error);
                // Handle the error, e.g., redirect to login page
                return res.redirect('/login');
            }

            const { reservationID } = req.body;
            console.log(req.body);

            db.query('DELETE FROM reservations WHERE reservationID = ?', [reservationID], (error, results) => {
                if (error) {
                    console.log(error);
                    // Handle the error, e.g., render an error page
                    return res.render('error', { error: 'Error deleting reservation' });
                } else {
                    console.log(results);
                    return res.render('dashboard', {
                        success: 'Reservation deleted'
                    });
                }
            });
        });
    } else {
        // Handle the case where there is no JWT cookie, e.g., redirect to login page
        res.redirect('/login');
    }
}




exports.logout = async (req, res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() +2*1000),
        httpOnly: true
    });
    res.status(200).redirect('/');
}