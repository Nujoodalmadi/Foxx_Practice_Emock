"use strict";
const joi = require("joi");

let product = {
    schema: {
      product_id: joi.number().required(),
      product_name: joi.string().required(),
      product_description: joi.string().required(),
      product_category: joi.object().keys({
        category_id: joi.number().required(),
        category_name: joi.string().required()
      }),
      price: joi.number().required(),
      availability: joi.boolean().required(),
      stock: joi.number().required(),
      specs: joi.string(),
      store_id: joi.number().required(),
      vendor_id: joi.number().required(),
      sku: joi.number(),
      sale: joi.object().keys({
        status: joi.string(),
        percentage: joi.string()
      })
    }
  }

  module.exports = product;
