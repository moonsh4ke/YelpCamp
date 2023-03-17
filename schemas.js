const Joi = require('joi');

module.exports.createCampgroundSchema = Joi.object({
  body: Joi.object({
    campground: Joi.object({
      title: Joi.string().required(),
      location: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().required(),
    }).required(),
  }),
  files: Joi.array().min(1).required(),
});

module.exports.editCampgroundSchema = Joi.object({
  body: Joi.object({
    campground: Joi.object({
      title: Joi.string().required(),
      location: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().required(),
    }).required(),
    deletedImg: Joi.array().optional(),
  }),
  files: Joi.array().required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required()
});

module.exports.userSchema = Joi.object({
  user: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().required(),
  }).required()
})
