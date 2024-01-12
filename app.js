const express= require("express");
const path = require("path");
const mysql = require("mysql");
// secure code best practice (dotenv package is used to hide sensitive data)
const dotenv = require("dotenv");

const cookieParser = require("cookie-parser");

// secure coding best practice
dotenv.config({path:"./.env"});

// db connection
const PORT = 3000;
const app = express();


const db = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE
})
db.connect((err)=>{
    if(err){
        console.log("Error connecting to database!");
        throw err;
    }
    console.log("Connected to database successfully!");
});


// setting up static files
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended:false}));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());


// setting up cookie parser
app.use(cookieParser());




// setting up view engine
app.set('view engine', 'hbs');

// setting up routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.get('/auth/dash.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/dash.css'));
});

app.get('/auth/reserv.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/reserv.css'));
});


// setting up server
app.listen(PORT,()=>{
    console.log(`Server is running on PORT: ${PORT}`)
});
