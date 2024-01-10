const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


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
        const {loginemail, loginpassword} = req.body;

        if(!loginemail || !loginpassword){
            return res.status(400).render('login', {
                message: 'Please provide an email and password'
            })
        }

        db.query('SELECT * FROM users WHERE email = ?', [loginemail], async (error, results) => {
            console.log(results);
            if(!results || !(await bcrypt.compare(loginpassword, results[0].password))){
                res.status(401).render('login', {
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