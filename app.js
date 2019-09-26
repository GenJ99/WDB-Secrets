//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

// Data enryption with amount of times the hashing will be salted
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));



mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = new mongoose.model("User", userSchema);



app.get("/", function(req, res) {
  res.render("home");
});



app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  // Bcrypt wiht hash method that with hash the password, salt it, and will call the needed code back
  // in a function. The hash parameter in the callback will equal the new password created.
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });

    newUser.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });
});



app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", function(req, res) {
  const userName = req.body.username;
  const password = req.body.password;

  User.findOne({
    email: userName
  }, function(err, foundUser) {

    if (err) {
      console.log(err);
    } else {

      if (foundUser) {
        // Comparing the login password to the password in the database with the compare() bcrypt method.
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if (result === true) {
            res.render("secrets");
          }
        });
      }
    }
  });
});



app.listen(3000, function() {
  console.log("Server is listening on port 3000");
});
