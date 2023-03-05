const Review = require('./review');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  author: String,
  location: String,
  title: String,
  description: String,
  price: Number,
  geometry: Object,
  images: Array,
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
