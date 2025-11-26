const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAPBOX_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });



module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
    };

module.exports.newForm=(req, res) => {
    res.render("listings/newform.ejs");
    };

    module.exports.create=async(req, res,next) => {
        const geoQuery = `${req.body.listing.location}, ${req.body.listing.country}`;
        let response = await geocodingClient.forwardGeocode({
        query: geoQuery,
        limit: 1
        })
        .send();

        let url=req.file.path;
        let filename=req.file.filename;
            const newListing = new Listing(req.body.listing);
            newListing.owner=req.user._id;
            newListing.geometry=response.body.features[0].geometry;
            newListing.image={url,filename};
            newListing.category = req.body.listing.category;

        console.log("BODY:", req.body);

            let savedListing= await newListing.save();
            console.log(savedListing);
            
            req.flash("success","New Listing Created Successfully !!");
            res.redirect("/listings");
        };

        module.exports.show=async (req, res) => {
    const { id } = req.params;
    const listings = await Listing.findById(id).
    populate({  //nested populate
        path:"reviews",
        populate:{
            path:"author",
        },
    }).populate("owner");
    
    if(!listings){
        req.flash("error","Listing Doesn't Exist !!");
        return res.redirect("/listings");
    }
    
    return res.render("listings/show.ejs", { listings });
    };

    module.exports.edit=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing Doesn't Exist !!");
        return res.redirect("/listings");
    }
    let ogImg=listing.image.url;
    ogImg=ogImg.replace("/upload","/upload/w_250");
    return res.render("listings/edit.ejs", { listing , ogImg});
    };

    module.exports.update=async (req, res) => {
    const { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    listing.category = req.body.listing.category;

    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
        
    req.flash("success"," Listing Updated Successfully !!");
    res.redirect(`/listings/${id}`);
    };

    module.exports.delete=async (req, res) => {
    const { id } = req.params;
    const deleted = await Listing.findByIdAndDelete(id);
    console.log("Deleted:", deleted);
    req.flash("success","Listing Deleted Successfully !!");
    res.redirect("/listings");
    }