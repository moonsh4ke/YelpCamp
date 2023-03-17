module.exports.asyncWrapper = (fn) => {
  return function (req, res, next) {
    fn(req,res,next).catch(e => next(e));
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) { return next()}
  req.session.returnTo = req.originalUrl;
  req.flash("error", "Woops, you must be logged in to visit that URL");
  res.redirect('/users/login');
}
