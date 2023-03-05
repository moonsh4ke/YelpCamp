const ExpressError = require('../utils/expressError');
const express = require('express');
const router = express.Router({mergeParams: true});
const {reviewSchema} = require('../schemas');
const Campground = require('../models/campground');
const asyncWrapper = require('../utils/asyncWrapper');
const Review = require('../models/review');

const validateReview = (req, res, next) => {
  const {error} = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 500);
  }
  return next()
}

router.delete('/:rid', asyncWrapper(async (req, res) => {
  const { id, rid } = req.params;
  await Campground.findByIdAndUpdate(id, {$pull: {review: rid}});
  await Review.findByIdAndDelete(rid);
  req.flash("success", "Successfully deleted review")
  res.redirect(`/campgrounds/${id}`);
}));

router.post('/', validateReview, asyncWrapper(async (req, res) => {
  // res.send(req.body)
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  await review.save()
  await campground.save()
  req.flash("success", "Successfully created review")
  res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;
