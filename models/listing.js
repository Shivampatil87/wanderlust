const mongoose = require("mongoose");
const review = require("./review");
const { ref } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
    price: Number,
    location: String,
    country: String,
  reviews : [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ], 
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }, 

//   category: {
//     type: String,
//     enum: ["mountain", "trending", "rooms", "castles", "iconic-cities", "camping", "farms", "arctic", "boating", "rainy", "peace", "trees", "swimming", "cloudy-sun", "beach", "moon"],
//     required: true,
// }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if( listing ) {
    await review.deleteMany({_id: { $in: listing.reviews }});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

