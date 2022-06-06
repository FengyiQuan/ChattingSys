module.exports = {
  requireAuthentication: function (req, res, next) {
    if (!req.isAuthenticated()) {
      req.flash('error_msg', 'Please log in to view that resource');
      return res.redirect('/login');
    }
    next();
  },
  forwardAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }
    next();
  },
};
