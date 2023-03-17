const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.delete = async (req, res) => {
  const { id, rid } = req.params;
  await Campground.findByIdAndUpdate(id, {$pull: {review: rid}});
  await Review.findByIdAndDelete(rid);
  req.flash("success", "Successfully deleted review")
  res.redirect(`/campgrounds/${id}`);
}

module.exports.create = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const review = new Review(req.body.review);
  review.user = req.user;
  campground.reviews.push(review);
  await review.save()
  await campground.save()
  req.flash("success", "Successfully created review")
  res.redirect(`/campgrounds/${id}`);
}
