const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');

module.exports.renderIndex = async (req, res) => {
  let campgrounds = await Campground.find({}).populate('author');
  res.render('campgrounds/index', {campgrounds});
}

module.exports.create = async (req, res) => {
  let new_campground = new Campground(req.body.campground);
  const images = req.files.map(image => ({url: image.path, filename: image.filename}));
  new_campground.author = req.user;
  new_campground.images = images;
  new_campground = await new_campground.save();
  req.flash("success", "Successfully made a new campground");
  res.redirect(`/campgrounds/${new_campground._id}`);
}

module.exports.update = async (req, res) => {
  const {id} = req.params;
  let campground = req.body.campground;

  campground = await Campground.findByIdAndUpdate(id, campground);

  // Add new images
  const images = req.files.map(image => ({url: image.path, filename: image.filename}));
  campground.images.push(...images);

  await campground.save()

  // Delete images
  if (req.body.deletedImg) {
    await campground.updateOne({$pull: {images: {filename: { $in: req.body.deletedImg}}}})
    cloudinary.api.delete_resources(req.body.deletedImg);
  }

  req.flash("success", "Successfully updated campground");
  res.redirect(`/campgrounds/${id}`);
}

module.exports.delete = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);
  req.flash("success", `Successfully deleted campground ${campground.title}`)
  res.redirect('/campgrounds');
}

module.exports.renderShow = async (req, res) => {
  const { id } = req.params;
  let campground;
  try {
    campground = await Campground.findById(id).
      populate({
        path: 'reviews',
        populate: {path: 'user'}
      }).
      populate('author').
      exec();

  } catch (e) {
    req.flash("error", "Campground not found")
    return res.redirect("/campgrounds");
  }
  res.render('campgrounds/show', {campground});
}

module.exports.renderEdit = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});
}

module.exports.renderNew = async (req, res) => {
  res.render('campgrounds/new');
}
