const Campground = require('../../models/campground');
const {editCampgroundSchema, createCampgroundSchema} = require('../../schemas');
const ExpressError = require('../../utils/expressError');
const { cloudinary } = require('../../cloudinary');

module.exports.validateCreateCampground = (req, res, next) => {
  const {error} = createCampgroundSchema.validate(req, {allowUnknown: true});
  if (error) {
    if (req.files.length) {
      const images = req.files.map(image => image.filename);
      cloudinary.api.delete_resources(images);
    }
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 500);
  }
  return next()
}

module.exports.validateEditCampground = (req, res, next) => {
  const {error} = editCampgroundSchema.validate(req, {allowUnknown: true});
  if (error) {
    const images = req.files.map(image => image.filename);
    cloudinary.api.delete_resources(images);
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 500);
  }
  return next()
}

module.exports.fileFilter = (req, file, cb) => {
  const {error} = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 500);
  }
  if (req.files.length) {
    cb(null,true);
  } else {
    cb(null,false);
    cb(new Error('fileFilter callback error'));
  }
}

module.exports.validateUser = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate('author');
  if (campground.author.equals(req.user)) { return next(); }
    req.flash("error", "Woops, you don't have permissions to edit that campground");
    res.redirect(`/campgrounds/${id}`);
}
