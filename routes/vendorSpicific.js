"use strict";
const createRouter = require("@arangodb/foxx/router");
const router = createRouter();
const _ = require("lodash");
const joi = require("joi");
const db = require("@arangodb").db;
const catchE = require("./error");

//MODELS
const storeModels = require("../models/store");
const branchModel = storeModels.branch;

//COLLECTIONS
const storesColl = module.context.collection("stores");

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
