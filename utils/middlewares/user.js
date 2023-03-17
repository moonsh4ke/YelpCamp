const {userSchema} = require('../../schemas');

module.exports.validateUser = (req, res, next) => {
  const {error} = userSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new Error(msg, 500);
  }
  return next()
}

