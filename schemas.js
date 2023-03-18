const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!'
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value) return helpers.error('string.escapeHTML', { value })
        return clean;
      }
    }
  }
})

const Joi = BaseJoi.extend(extension);

module.exports.createCampgroundSchema = Joi.object({
  body: Joi.object({
    campground: Joi.object({
      title: Joi.string().required().escapeHTML(),
      location: Joi.string().required().escapeHTML(),
      description: Joi.string().required().escapeHTML(),
      price: Joi.number().required(),
    }).required(),
  }),
  files: Joi.array().min(1).required(),
});

module.exports.editCampgroundSchema = Joi.object({
  body: Joi.object({
    campground: Joi.object({
      title: Joi.string().required().escapeHTML(),
      location: Joi.string().required().escapeHTML(),
      description: Joi.string().required().escapeHTML(),
      price: Joi.number().required(),
    }).required(),
    deletedImg: Joi.array().optional(),
  }),
  files: Joi.array().required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML(),
  }).required()
});

module.exports.userSchema = Joi.object({
  user: Joi.object({
    username: Joi.string().required().escapeHTML().pattern(/[a-zA-z\d]{4,}/),
    password: Joi.string().required().escapeHTML().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/),
    email: Joi.string().required().escapeHTML().email(),
  }).required()
})
