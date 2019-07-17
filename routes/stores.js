"use strict";
const createRouter = require("@arangodb/foxx/router");
const router = createRouter();
const _ = require("lodash");
const joi = require("joi");
const db = require("@arangodb").db;
const catchE = require("./error");

//COLLECTIONS
const storesCollection = module.context.collection("stores");
const products = module.context.collection("products");

router.tag("stores");
//Returns: store_name , status, and category_name of all stores
router
  .get("/", function(req, res) {
    try {
      res.json(
        _.map(storesCollection.toArray(), store => {
          return _.omit(store, ["_key", "_id", "_rev"]);
        })
      );
    } catch (e) {
      catchE(res, e);
    }
  })
  .summary("Retrieve a list stores")
  .description(
    "Retrieves all stores from the stores collection, icluding branches"
  );

//Returns branches of a particular store
router
  .get("/:store_id", function(req, res) {
    try {
      const data = storesCollection.document(req.pathParams.store_id);
      const brances = data["store_branches"];
      res.send(brances);
    } catch (e) {
      catchE(res, e);
    }
  })
  .pathParam("store_id", joi.string().required(), "store id (key)")
  .response(joi.object().required(), "branches of a particular store")
  .summary("branches of a particular store")
  .description("Retrieves all branches of a particular store.");

//Returns products of a particular store
router
  .get("/:store_id/products", function(req, res) {
    try {
      const store_id = req.pathParams.store_id;
      let query1 = `let storeId = ${store_id}
      FOR p IN ${products}
    FILTER p.store_id == storeId 
    RETURN p`;
      let qResult = db._query({
        query: query1,
        cache: true /* cache attribute set here */
      });
      res.status(200);
      res.setHeader("Content-Type", "application/json");
      res.send(qResult);
    } catch (e) {
      if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
        throw e;
      }
      res.throw(404, "The entry does not exist", e);
    }
  })
  .response(joi.object().required(), "success.")
  .summary("Retrieve all products in a particular store")
  .description("Retrieves all products in products etest_products collection");
module.exports = router;
