const ExpressError = require('../utils/expressError');
const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas');
const asyncWrapper = require('../utils/asyncWrapper');

// define own router middlewares

// function defs

const validateCampground = (req, res, next) => {
  const {error} = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 500);
  }
  return next()
}

// define routes

router.get('/', asyncWrapper(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', {campgrounds});
}));

router.get('/new', asyncWrapper(async (req, res) => {
  res.render('campgrounds/new');
}))

router.post('/', validateCampground, asyncWrapper(async (req, res) => {
  let new_campground = new Campground(req.body.campground);
  new_campground.images = [];
  new_campground.images.push({url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png'});
  new_campground = await new_campground.save();
  req.flash("success", "Successfully made a new campground");
  res.redirect(`/campgrounds/${new_campground._id}`);
}))

router.put('/:id', validateCampground, asyncWrapper(async (req, res) => {
  const {id} = req.params;
  const campground = req.body.campground;
  campground.images = [];
  campground.images.push({url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png'});
  await Campground.findByIdAndUpdate(id, campground);
  req.flash("success", "Successfully updated campground");
  res.redirect(`/campgrounds/${id}`);
}))

router.get('/:id', asyncWrapper(async (req, res) => {
  const { id } = req.params;
  let campground;
  try {
    campground = await Campground.findById(id).populate('reviews');
  } catch {
    req.flash("error", "Campground not found")
    res.redirect("/campgrounds");
  }
  res.render('campgrounds/show', {campground});
}))

router.get('/:id/edit', asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/edit', {campground});
}))

router.delete('/:id', asyncWrapper(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  console.log(req.url);
  res.redirect('/campgrounds');
}))

module.exports = router;
