const Listing = require("./models/listing");
const Review = require("./models/review");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to access this page.");
        return res.redirect("/login");
    }
    next();  
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);

        // Handle case where listing is not found
        if (!listing) {
            req.flash("error", "Listing not found.");
            return res.redirect("/listings");
        }

        // Ensure currUser exists before accessing _id
        if (!res.locals.crrUser) {
            req.flash("error", "You need to be logged in.");
            return res.redirect("/login");
        }

        // Check if the logged-in user is the owner
        if (!listing.owner.equals(res.locals.crrUser._id)) {
            req.flash("error", ".You are not the owner of this listings.");
            return res.redirect(`/listings/${id}`);
        }

        next();
    } catch (error) {
        console.error("Error in isOwner middleware:", error);
        req.flash("error", "You do not have permission to modify this listing");
        return res.redirect("/listings");
    }
};

module.exports.isReviewAuthor= async (req, res, next) => {
    try {
        let {id, reviewId } = req.params;
        let review = await Review.findById(reviewId);

        // Handle case where listing is not found
        if (!review) {
            req.flash("error", "Listing not found.");
            return res.redirect("/listings");
        }

        // Ensure currUser exists before accessing _id
        if (!res.locals.crrUser) {
            req.flash("error", "You need to be logged in.");
            return res.redirect("/login");
        }

        // Check if the logged-in user is the owner
        if (!review.author.equals(res.locals.crrUser._id)) {
            req.flash("error", ".You are not the author of this listings.");
            return res.redirect(`/listings/${id}`);
        }

        next();
    } catch (error) {
        console.error("Error in isOwner middleware:", error);
        req.flash("error", "You do not have permission to modify this listing");
        return res.redirect("/listings");
    }
};