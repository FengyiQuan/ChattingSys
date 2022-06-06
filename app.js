const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const path = require('path');
const { mongoURI, expressSession } = require('./config/settings');

const app = express();
const { server, io } = require('./config/socket-init')(app);
// console.log(server);

const initPassport = require('./config/passport-init');

// connect to mongoose db
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected ...'))
  .catch((e) => console.log(e));

initPassport(passport);

app.use(express.static(path.join(__dirname, '/public')));
app.use(
  '/css',
  express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css'))
);
app.use(
  '/js',
  express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'))
);
app.use(
  '/js',
  express.static(path.join(__dirname, 'node_modules/jquery/dist'))
);
app.use(express.urlencoded({ extended: true })); // bodyParser
app.use(express.json());
app.use(expressEjsLayouts);

app.set('view engine', 'ejs');
app.set('layout', 'layouts/side-bar');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// session({ secret: "secret", resave: false, saveUninitialized: false });
app.use(expressSession);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// middlewire to set up flash messages
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  // console.log(res.locals.error_msg);
  // for passport error message display in login page.
  res.locals.error = req.flash('error');
  next();
});

// middlewire to expose user session
app.use(function (req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});

const indexRouter = require('./routes/index');
const chatRoomRouter = require('./routes/chatRoom');
const authRouter = require('./routes/auth');
const apiRouter = require('./routes/api');

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/chatRoom', chatRoomRouter);
app.use('/', apiRouter);
// app.use("/users", userRouter)

const port = process.env.PORT || 8081;

server.listen(port, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log('应用实例，访问地址为 http://%s:%s', host, port);
});
