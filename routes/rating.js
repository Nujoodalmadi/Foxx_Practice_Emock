"use strict";
const createRouter = require("@arangodb/foxx/router");
const router = createRouter();
const joi = require("joi");

//Collections
const ratingColl = module.context.collection("customer_rating");

router.tag("customer");
router
  .post("/rating", function(req, res) {
    const data = req.body;
    const meta = ratingColl.save(req.body);
    res.send(Object.assign(data, meta));
  })
  .body(joi.object().required(), "new rating")
  .summary("posts a customer rating ")
  .description("posts a customer rating to etest_customer_rating collection ");

module.exports = router;
