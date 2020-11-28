
if (process.env.NODE_ENV != 'production') {
  /**
   * Only configure dotenv if it is a developement build. 
   */
  require("dotenv").config();
}
const express = require('express');
const glob = require('glob');
const mongoose = require('mongoose');
const expressSession = require("express-session")

const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const path = require('path')

mongoose.connect(process.env.MONGODBURI)
.then(res => {
  console.log('conected')
}).catch(err => {throw err});;
const User = require("./models/user")
const db = mongoose.connection;
db.on("connected", () => {
  console.log("connected!")
})
db.on('error', () => {
  console.log('error!')
  throw new Error('unable to connect to database at ' + process.env.MONGODBURI);
});

/* We will check to see if an admin account already exists. If it does, we don't
 * do anything, but if it does not, we create one.
 */

User.findOne({}).then(foundUser => {
  console.log("No user found!")
  if (!foundUser) {
    User.register(new User ({
      username: process.env.ADMINNAME, 
      name: process.env.ADMINNAME, 
      admin: true,
      bio: {
        md: "The admin of this page",
        html: "<p>The admin of this page</p>"
      },
      email: "admin@admin.com"
    }), process.env.ADMINPASS).then(user => {
      console.log(user)
    }).catch(err => {
      console.log(err)
    })
  }
  console.log(foundUser)
}).catch(err => {
  console.log(err)
})
const app = express();

const env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(compress());
app.use(methodOverride());
app.use(expressSession({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: false
  }
}))

let LocalStrategy = require("passport-local") 
const passport = require("passport");
passport.use(new LocalStrategy(User.authenticate()))
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname,'build')))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/build/index.html")
})

app.use("/auth", require("./routes/auth"));
app.use("/posts", require("./routes/post"));
app.use("/users", require("./routes/user"))
app.use("/tags", require("./routes/tag"))

app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app
