"use strict";
const joi = require("joi");

let customerOrder = {
  schema: {
    order_id: joi.number().required(),
    customer_id: joi.number().required(),
    driver_id: joi.number().optional(),
    status: joi.array().required(),
    order_total: joi.number().required(),
    order_tax: joi.number().optional(),
    cart_obj: joi.array().items(
      joi.object().keys({
        product: joi.string().required(),
        quantity: joi
          .number()

          .required()
      })
    )
  }
};


module.exports = customerOrder;
