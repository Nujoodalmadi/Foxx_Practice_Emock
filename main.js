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
