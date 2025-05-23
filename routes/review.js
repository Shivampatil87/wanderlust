const express = require("express");
const router = express.Router({ mergeParams: true }); 
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewcontroller = require("../controllers/review.js");

// 🛠 Middleware: Validate Listings
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};

//Post Review Route
router.post("/", 
  isLoggedIn, 
  validateReview, 
  wrapAsync(reviewcontroller.createReview));
  
  
//Delete Review Route
 router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewcontroller.distroyReview));

  module.exports = router;
