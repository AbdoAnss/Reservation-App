const express= require("express");
const path = require("path");
const mysql = require("mysql");

const PORT = 3000;
const app = express();
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:""
})
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "auth.html"));
});
app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
});
