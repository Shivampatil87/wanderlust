const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


module.exports.showListing = (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate: {
        path: "author",
      },
   })  
    .populate("owner");
    
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings"); 
    }

    res.render("listings/show.ejs", { listing, crrUser: req.user });
});


module.exports.createListing = (async (req, res) => {
    let url = req.file.path;
    let filename  = req.file.filename;
   
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
});

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image?.url || "";
    if (originalImageUrl) {
        originalImageUrl = originalImageUrl.replace(
            "/upload",
            "/upload/w_300,h_250,c_fill"
        );
    }
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};


module.exports.updateRoutes =(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

   if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
   }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
});

module.exports.distroyRoutes = (async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
});