"use strict";

//ROUTES
const stores = require("./routes/stores");
module.context.use("/stores", stores);

const order = require("./routes/order");
module.context.use("/customer", order);

const rating = require("./routes/rating");
module.context.use("/customer", rating);
