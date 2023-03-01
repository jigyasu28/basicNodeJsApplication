const express = require('express');
const mysql = require('mysql2');
const ejs = require('ejs');
const session = require('express-session');
const port = 3000;
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

// create a database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'mydatabase'
});

// connect to the database
connection.connect();

// set up the view engine
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static("/public"));
// // set up the session middleware
app.use(session({
  secret: 'mysecretkey',
  resave: true,
  saveUninitialized: true
}));

// // set up the routes
// app.get('/mobiles', (req, res) => {
//   // query the database to get the list of mobiles
//   const sql = 'SELECT * FROM mobiles';
//   connection.query(sql, (error, results, fields) => {
//     if (error) throw error;

//     // render the mobile list page and pass in the mobiles data
//     res.render('mobiles', { mobiles: results });
//   });
// });
var current_user = false;
app.get("/", function(req, res) {
    if(current_user==true) res.redirect('/contact');
    res.render('signup');
})

app.get('/login', (req, res) => {
  // render the login page
  res.render('login');
});


app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // query the database to check if the user exists
  const sql = 'SELECT username, password FROM user WHERE username = ? AND password = ?';
  connection.query(sql, [username, password], (error, results, fields) => {
    if (error) throw error;

    if (results.length > 0) {
      // set the session variable to indicate that the user is logged in
      req.session.loggedIn = true;
      current_user=true;
      // redirect the user to the mobile list page
      res.redirect('/mobiles');
    } else {
      // render the login page with an error message
      res.render('login', { error: 'Invalid username or password' });
    }
  });
});

app.get('/logout', (req, res) => {
  // destroy the session to log the user out
  req.session.destroy();
  current_user=false;
  // redirect the user to the login page
  res.redirect('/login');
});




app.get('/signup', (req, res) => {
  // render the login page
  res.render('signup');
});

app.post('/signup', (req, res) => {
  console.log("entered signup post");
  if (req.body.password != req.body.confirmpassword){
    alert("Password not matched!");
      res.redirect("/");
  }

  var sql = "select * from user where email='" + req.body.email + "'";
  connection.query(sql, function(err, result, feilds) {
        if (err) throw err;
        else{
            console.log("No errors!");
        }
        if (result.length == 0) {
            var sql = "insert into user(username, email, password) values ?";
            var values=[[req.body.username, req.body.email, req.body.password]];
            connection.query(sql, [values], function(err, result) {
                if (err) throw err
                console.log("data added successfully");
            })

            res.redirect("/Login");
        }else{

            res.redirect('/');
        }
    })
});


app.get('/contact', (req, res) => {
  // render the contact page
  console.log(current_user);
   if(current_user==true)
     res.render('contact');
    else
      res.render('login');
});



app.post('/contact', (req, res) => {
  // render the contact page
    var name=req.body.name;
    var email=req.body.email;
    var subject=req.body.subject;
    var message=req.body.message;
    var sql = "insert into contact(name, email, subject, message) values ?";
            var values=[[name, email, subject, message]];
            connection.query(sql, [values], function(err, result) {
                if (err) throw err
                console.log("Contact data added successfully");
            })
    res.redirect("/mobiles");
});





app.get('/mobiles', (req, res) => {
  // render the login page
  if(current_user==true)
     res.render('mobiles');
    else
      res.render('login');
});


app.get('/logout', (req, res) => {
  // render the login page
  req.body.username=null;
  req.body.password=null;
  current_user=false;
  res.render('logout');
});



// start the server
app.listen(port, function() {
    console.log("Server started on port.");
    console.log(`Example app listening at http://localhost:${port}`);
});
