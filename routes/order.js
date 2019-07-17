"use strict";

const db = require("@arangodb").db;
const createRouter = require("@arangodb/foxx/router");
const router = createRouter();
const joi = require("joi");
const catchE = require("./error");

//COLLECTIONS
const customerOrders = module.context.collection("customer_orders");
router.tag("customer");
//Recieves customer_id and cart_obj (including store_id of product) from the frontend. Sends this info to customer_orders collection
router
  .post("/order/:customer_id", function(req, res) {
    try {
      console.debug(req.body);
      let customer_id = req.pathParams.customer_id;
      let customer_order = req.body;
      let orderToStoreObj = {
        customer_id: customer_id,
        driver_id: null,
        status: [
          {
            timestamp: Date.now(),
            status_checkout: true
          },
          {
            timestamp: null,
            status_received: false
          },
          {
            timestamp: null,
            status_pickedup: false
          },
          {
            timestamp: null,
            status_delivered: false
          }
        ],
        order_total: customer_order.order_total,
        order_tax: null, //will be handeled later
        cart_obj: customer_order.cart_obj //list of products
      };

      console.log("Nujood   >" + orderToStoreObj);

      if (orderToStoreObj) {
        res.status(200);
        console.log("I'm here");
        customerOrders.save(orderToStoreObj); // creates new doc
        res.send(orderToStoreObj.json);
      } else {
        res.status(200).send({
          status: false
        });
      }
    } catch (e) {
      catchE(res, e);
    }
  })
  .body(joi.object().required())
  .summary("Send order to store")
  .description("This endpoint sends an order to the store")
  .pathParam("customer_id", joi.string().required(), "customer id (key)");

module.exports = router;
