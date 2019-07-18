"use strict";

const db = require("@arangodb").db;
const _ = require("lodash");
const createRouter = require("@arangodb/foxx/router");
const router = createRouter();
const joi = require("joi");
const catchE = require("./error");
const orderModel = "../models/order";

//COLLECTIONS
const customerOrders = module.context.collection("customer_orders");

router.tag("order");
//Recieves customer_id and cart_obj (including store_id of product) from the frontend. Sends this info to customer_orders collection
router
  .post("customer/:customer_id", function(req, res) {
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
            status_received: false // true - false - failed
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
        customerOrders.save(orderToStoreObj); // creates new doc
        res.send(orderToStoreObj.json);
      }
    } catch (e) {
      catchE(res, e);
    }
  })
  .body(joi.object().required())
  .summary("Send order to store")
  .description("This endpoint sends an order to the store")
  .pathParam("customer_id", joi.string().required(), "customer id (key)");

//Fetches pending orders

router
  .get("/vendor_pending", (req, res) => {
    try {
      const pendingOrders = customerOrders
        .toArray()
        .filter(
          order =>
            order.status[0].status_checkout === true &&
            order.status[1].status_received === false
        );
      if (!pendingOrders || pendingOrders.length === 0) {
        res.send("No pending orders");
      }
      res.json(
        _.map(pendingOrders, order => {
          return _.omit(order, ["driver_id", "status"]);
        })
      );
    } catch (e) {
      catchE(res, e);
    }
  })
  .summary("fetches pending orders")
  .description(
    "This endpoint fetches orders from etest_customer_orders collection to be accepted by the store"
  );

//recieves order_id  from frontend, then updates the order (status_received: true)
//MODIFY: send to driver
router
  .patch("/status_recieved/:order_id", function(req, res) {
    try {
      let order = customerOrders.document(req.pathParams.order_id);
      order.status[1] = {
        timestamp: Date.now(),
        status_received: true // true - false - failed
      };
      let updatedOrder = customerOrders.update(req.pathParams.order_id, order);
      res.send(updatedOrder);
    } catch (e) {
      catchE(res, e);
    }
  })
  .pathParam("order_id", joi.string().required(), "id of the order.")
  .summary("changes the state of the order => recieved by store")
  .description(
    "changes the state of the order => recieved by changing the status in etest_customer_orders collection "
  );

module.exports = router;
