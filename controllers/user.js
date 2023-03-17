const User = require('../models/user');

module.exports.logout = (req, res) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
  });
}
module.exports.renderRegister = (req, res) => {
  res.render('register');
}
module.exports.update = async (req, res) => {
}

module.exports.delete = async (req, res) => {
}

module.exports.renderLogin = (req, res) => {
  res.render('login');
}

// TODO: fix this to dont use failureFlash because it introduced security risks (use redis)
module.exports.auth = function(req, res) {
  let redirectUrl;
  if (req.session.returnTo) {
    redirectUrl = req.session.returnTo;
  } else {
    redirectUrl = "/";
  }
  delete req.session.returnTo
  res.redirect(redirectUrl);
}

module.exports.create = async(req, res, next) => {
  const { username, password, email } = req.body.user;
  const user = new User({ "username" : username, email });
  try {
    await User.register(user, password);
    const redirectUrl = req.session.returnTo || "/";
    req.login(user, (err) => {
      if(err) {return next(err)}
      req.flash("success", `Welcome to YelpCamp ${username}`)
      res.redirect(redirectUrl);
    });
  } catch (e){
    req.flash("error", e.message);
    res.redirect("/users/register");
  }
}
