const Review = require('./review');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    }
  },
  images: [
    {
      url: String,
      filename: String,
    }
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
})


CampgroundSchema.post('findOneAndDelete', async (campground)=> {
  if(campground) {
    // for(let review of campground.reviews) {
    //   await Review.findByIdAndDelete(review)
    // }
    await Review.remove({
      _id: {
        $in: campground.reviews
      }
    })
  }
})
module.exports = mongoose.model('Campground', CampgroundSchema);
