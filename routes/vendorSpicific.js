"use strict";
const createRouter = require("@arangodb/foxx/router");
const router = createRouter();
const _ = require("lodash");
const joi = require("joi");

const { db, aql } = require("@arangodb");
const catchE = require("./error");
const restrict = require("../util/restrict");
const hasPerm = require("../util/hasPerm");

//MODELS
const storeModels = require("../models/store");
const branchModel = storeModels.branch;

//COLLECTIONS
const storesColl = module.context.collection("stores");
const perms = module.context.collection("hasPerm");

router.tag("vendor");

//Posts a branch to an existing store
router
  .patch(":store_id/newBranch", (req, res) => {
    try {
      if (req.user.store_id === req.pathParams.store_id) {
        const store = storesColl.document(req.pathParams.store_id);
        const newBranchesList = _.concat(store.store_branches, req.body);
        store.store_branches = newBranchesList;
        const updatedStore = storesColl.update(req.pathParams.store_id, store);
        res.send(updatedStore);
      } else {
        res.send({ success: false });
      }
    } catch (e) {
      catchE(res, e);
    }
  })
  .pathParam("store_id", joi.string().required(), "id of the store")
  .body(branchModel.schema)
  .summary("adds a new branch")
  .description(
    "adds a new branch to etest_stores collection, store_branches list "
  );

/*****************************************************************************************************************/

router
  .post("/new-product", (req, res) => {
    try {
      const data = req.body;
      const meta = productsColl.save(req.body);
    } catch (e) {
      catchE(res, e);
    }
  })
  .body(productModel.schema)
  .summary("add a new product")
  .description("add a new product to etest_products collection");

/*************************************************************************************************************/

router
  .patch("/update/:productId", (req, res) => {
    const productId = req.pathParam.productId;
    const newData = productModel.schema;
    try {
      const query = aql`FOR p IN ${productsColl}
      FILTER p.product_id == ${productId}
      UPDATE p WITH ${newData} IN ${productsColl}
      RETURN p`;
      let qResult = db._query({
        query: query,
        cache: true /* cache attribute set here */
      });
      res.status(200);
      res.setHeader("Content-Type", "application/json");
      res.send(qResult);
    } catch (e) {
      catchE(res, e);
    }
  })
  .body(productModel.schema)
  .summary("edit a product")
  .description("edit a product in etest_products collection");
module.exports = router;
