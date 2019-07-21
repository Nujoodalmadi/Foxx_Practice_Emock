"use strict";

//ROUTES
const stores = require("./routes/stores");
module.context.use("/stores", stores);

const order = require("./routes/order");
module.context.use("/order", order);

const rating = require("./routes/rating");
module.context.use("/customer", rating);

const vendorSpecific = require("./routes/vendorSpicific");
module.context.use(vendorSpecific);

//MIDDLEWARE
const sessions = require("./util/sessions");
module.context.use(sessions);

//Auth Routes
const customerAuth = require("./routes/auth");
module.context.use(customerAuth);

// Permissions:
const vendors = module.context.collection("vendor");
module.context.use(function(req, res, next) {
  if (req.session.uid) {
    try {
      req.user = vendors.document(req.session.uid); // req.user vs req.arangoUser
    } catch (e) {
      req.session.uid = null; //If the user was deleted, they are automatically logged out.
      req.sessionStorage.save();
    }
  }
  next();
});
