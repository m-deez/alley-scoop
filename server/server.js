//require("dotenv").config();
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });
/* ==== External Modules ==== */
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const users = require("./routes/api/users");
const posts = require("./routes/api/posts")
/* ==== Internal Modules ==== */
//const routes = require("./routes/api/users");
// const routes = require("./routes/api")
/* ==== Instanced Modules  ==== */
const app = express(); // create express app
/* ====  Configuration  ==== */
const PORT = process.env.PORT || 5000;


/* ====  Middleware  ==== */
// Passport middleware
app.use(passport.initialize());
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
//Mongoose Connection import
require("./mongoose-connection");
// Passport config
require("./passport")(passport);
// Routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use('/api/users/login', users);

//Cors
app.use(cors());
// to serve static files and to serve the react build
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));
// JSON parsing middleware
app.use(express.json());

//Allow origin access origin and methods 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

//custom logger to show the url and req.body if one exists
app.use((req, res, next) => {
  console.log(req.url);
  // is there an auth header
  console.log("AUTH HEADER: ", req.headers.authorization);
  if (req.body) {
    console.log("BODY BEING SENT: ", req.body);
  }
  next();
});

/* ====  Routes & Controllers  ==== */
// All of our routes will start with "/api", we're going to route them through index.js
// app.use("/api", routes);

//This is to catch anything that's trying to hit an api route that isn't made
app.all("/api/*", function (req, res, next) {
  res.send("THIS IS NOT AN API ROUTE");
});

//IS THE REACT FULL STACK MAGIC MIDDLEWARE
/*
ANY REQUEST not covered by routes express makes -- will get piped to this middleware
and this middleware's job is to handover control to react
*/
app.use((req, res, next) => {
  console.log(req.headers);
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

/* ====  Server Listener / Connection ==== */
// start express server on port 5000
app.listen(PORT, () => {
  console.log("Successfully connected to Alley-Scoop!");
});