"use strict";
const createRouter = require("@arangodb/foxx/router");
const router = createRouter();
const _ = require("lodash");
const joi = require("joi");
const { db, aql } = require("@arangodb");
const catchE = require("./error");

//MODELS
const storeModels = require("../models/store");
const branchModel = storeModels.branch;
const productModel = require('../models/product');

//COLLECTIONS
const storesColl = module.context.collection("stores");
const productsColl = module.context.collection('products');

router.tag("vendor");

//Posts new branch to an existing store
// MODIFY (permission => only vendor can add a new branch)
router
  .patch(":store_id/newBranch", (req, res) => {
    try {
      const store = storesColl.document(req.pathParams.store_id);
      const newBranchesList = _.concat(store.store_branches, req.body);
      store.store_branches = newBranchesList;
      const updatedStore = stores.update(req.pathParams.store_id, store);
      res.send(updatedStore);
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


module.exports = router;

/*****************************************************************************************************************/

router.post('/new-product', (req, res) => {
  try{
    const data = req.body;
    const meta = productsColl.save(req.body);
  }catch(e){
    catchE(res, e);
 }
}).body(productModel.schema)
.summary("add a new product")
  .description(
    "add a new product to etest_products collection"
  );

  /*************************************************************************************************************/

  router.patch('/update/:productId', (req, res) => {
    const productId = req.pathParam.productId;
    const newData = productModel.schema;
    try{
      const query = aql`FOR p IN ${productsColl}
      FILTER p.product_id == ${productId}
      UPDATE p WITH ${newData} IN ${productsColl}
      RETURN p`
      let qResult = db._query({
        query: query,
        cache: true /* cache attribute set here */
      });
      res.status(200);
      res.setHeader("Content-Type", "application/json");
      res.send(qResult);
    }catch(e){
      catchE(res, e);
   }
  }).body(productModel.schema)
  .summary("edit a product")
    .description(
      "edit a product in etest_products collection"
    );
