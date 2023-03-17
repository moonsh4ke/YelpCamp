const {reviewSchema} = require('../../schemas');
const Review = require('../../models/review');
const ExpressError = require('../../utils/expressError');
const Campground = require('../../models/campground');

module.exports.validateReview = (req, res, next) => {
  const {error} = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 500);
  }
  return next()
}

module.exports.userCanCreate = async (req, res, next) => {
  const {id} = req.params;
  const campground = await Campground.findById(id).
      populate({
        path: 'reviews',
        populate: {path: 'user'}
      }).
      populate('author').
      exec();

  // User is not the author of campground
  if(!campground.author.equals(req.user)) {
    // Is the first rating
    for(let review of campground.reviews) {
      if (review.user.equals(req.user)) {
        req.flash("error", "You can only create one review per campground");
        return res.redirect(`/campgrounds/${id}`);
      }
    }
    return next();
  } else {
    req.flash("error", "You can't create a review if you are the author of the campground");
    return res.redirect(`/campgrounds/${id}`);
  }
}

module.exports.userCanDelete = async (req, res, next) => {
  const {id, rid} = req.params;
  const review = await Review.findById(rid).populate('user');
  if(review.user.equals(req.user)) {
    return next()
  }
  req.flash("error", "You don't have permissions to delete that review");
  res.redirect(`/campgrounds/${id}`);
}
