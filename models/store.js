"use strict";

const joi = require("joi");

let store = {
  schema: {
    store_id: joi
      .number()
      .integer()
      .required(),
    store_name: joi
      .number()
      .string()
      .required(),
    status: joi
      .number()
      .string()
      .required(),

    store_branches: joi
      .array()
      .items()
      .required(),
    order_tax: joi.number().optional(),
    cart_obj: joi.array().items(
      joi.object().keys({
        branch_id: joi
          .number()
          .integer()
          .required(),
        address: joi
          .object()
          .keys({
            city: joi.string().required(),
            district: joi.string().required(),
            long: joi.number().optional(),
            lat: joi.number().optional()
          })
          .required()
      })
    ),
    store_category: joi.object().keys({
      category_id: joi
        .number()
        .integer()
        .required(),
      category_name: joi.string().required()
    })
  }
};
module.exports = store;
