const Joi=require('joi');

module.exports.itemSchema=Joi.object({
    obj:Joi.object({
        image:Joi.string().allow("",null),
        location:Joi.string().required(),
        description:Joi.string().required(),
        keywords:Joi.string().required(),
        date:Joi.string().required(),
    }).required(),
})




