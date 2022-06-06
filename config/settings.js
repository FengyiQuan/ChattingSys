const session = require('express-session');
module.exports = {
  deployURL: 'http://localhost:8081',
  mongoURI:
    'mongodb+srv://Nelson:ruqiulixia0220@chatsys.czvnacb.mongodb.net/?retryWrites=true&w=majority',
  expressSession: session({
    secret: 'secret', // process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true },
  }),
};
