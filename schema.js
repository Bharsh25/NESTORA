const Joi=require('joi');
const review = require('./models/review');

module.exports.listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required().min(0),
        country:Joi.string().required(),
        image:Joi.string().allow("",null),
        location:Joi.string().required(),
            category: Joi.string()
        .valid(
            "Swimming Pools",
            "Mountain",
            "Castle",
            "Trending",
            "Arctic",
            "Domes",
            "Boats",
            "Iconic Cities",
            "Rooms",
            "Campaign",
            "Farms"
        ).required(),

    }).required()
});

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required()
});