"use strict";
const createRouter = require("@arangodb/foxx/router");
const router = createRouter();
const _ = require("lodash");
const joi = require("joi");
const db = require("@arangodb").db;
const catchE = require("./error");

//MODEL
const storeModels = require("../models/store");
const branchModel = storeModels.branch;
//COLLECTIONS
const stores = module.context.collection("stores");

router.tag("vendor");

//Posts new branch to an existing store
// MODIFY (provide auth => only vendor can add a new branch)
router
  .patch(":store_id/newBranch", (req, res) => {
    try {
      let store = stores.document(req.pathParams.store_id);
      const addBranch = _.concat(store.store_branches, req.body);
      res.send(addBranch);
    } catch (e) {
      catchE(res, e);
    }
  })
  .pathParam("store_id", joi.string().required(), "id of the store")
  .body(branchModel)
  .summary("adds a new branch")
  .description("adds a new branch to etest_stores collection ");

module.exports = router;
