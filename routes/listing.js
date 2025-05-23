const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingcontroller = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudconfig.js")
const upload = multer({ storage });


// 🛠 Middleware: Validate Listings
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg); // Changed status to 400 (Bad Request)
    }
    next();
};

router.route("/")
.get(wrapAsync(listingcontroller.index))
.post(
    isLoggedIn, 
     upload.single('listing[image]'),
     validateListing,
     wrapAsync(listingcontroller.createListing)
 );


// 📌 New Route
router.get("/new", isLoggedIn, listingcontroller.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingcontroller.showListing))
.put(isLoggedIn, 
    isOwner, 
    upload.single('listing[image]'),
    validateListing, 
    wrapAsync(listingcontroller.updateRoutes))
.delete(isLoggedIn, 
    isOwner, 
    wrapAsync(listingcontroller.distroyRoutes)
 );

// 📌 Edit Listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingcontroller.renderEditForm));


module.exports = router;
