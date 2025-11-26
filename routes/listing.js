const express = require("express");
const router=express.Router();
const ExpressError=require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../schema.js");
const Listing = require("../models/listing.js");
const{isLoggedIn, isOwner,validateListing}=require("../middleware.js")

const listingController=require("../controllers/listing.js")

const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage })

router.route("/")
    .get( wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'),wrapAsync(validateListing),  wrapAsync(listingController.create));// CREATE - add new listing to DB
    

    // NEW - form to create a new listing
    router.get("/new", isLoggedIn,listingController.newForm);

    router.get("/search", async (req, res) => {
    const { country } = req.query;

    // If empty query, redirect back
    if (!country || country.trim() === "") {
        return res.redirect("/listings");
    }

    // Case-insensitive search
    const allListings = await Listing.find({
        $or: [
        { country: { $regex: country, $options: "i" }},
        { location: { $regex: country, $options: "i" }}
        ]
    });

    res.render("listings/index.ejs", { allListings });
});


router.route("/:id")
.get( wrapAsync(listingController.show)) //Show
.put(isLoggedIn,isOwner,  upload.single('listing[image]'), wrapAsync(validateListing), wrapAsync(listingController.update)) //Update
.delete(isLoggedIn,isOwner, wrapAsync(listingController.delete)); //Delete

    // EDIT - show edit form
    router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync( listingController.edit));


    router.get("/category/:cat", async (req, res) => {
    const { cat } = req.params;

    // Find listings where category = "Swimming Pools" / "Mountain" / etc.
    const allListings = await Listing.find({ category: cat });

    res.render("listings/index.ejs", { allListings });
});


    module.exports=router;