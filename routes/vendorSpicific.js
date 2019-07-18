"use strict";
const createRouter = require("@arangodb/foxx/router");
const router = createRouter();
const _ = require("lodash");
const joi = require("joi");
const db = require("@arangodb").db;
const catchE = require("./error");

//POST/DELETE/PATCH product to products_in_store > modi
//POST/DELETE/PATCH new store and branch

router.tag("vendor");

//Posts new store
router.post("/newStore", (req, res) => {});

module.exports = router;
