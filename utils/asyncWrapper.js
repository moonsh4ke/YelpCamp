const asyncWrapper = (fn) => {
  return function (req, res, next) {
    fn(req,res,next).catch(e => next(e));
  }
};

module.exports = asyncWrapper;
