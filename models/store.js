"use strict";

const joi = require("joi");

let store = {
  schema: {
    store_id: joi.required(),
    store_name: joi.string().required(),
    status: joi.string().required(),
    store_branches: joi.array().items(
      joi.object().keys({
        branch_id: joi.number().required(),
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

        .required(),
      category_name: joi.string().required()
    })
  }
};

let branch = {
  schema: {
    branch_id: joi
      .number()

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
  }
};
module.exports = { store, branch };
