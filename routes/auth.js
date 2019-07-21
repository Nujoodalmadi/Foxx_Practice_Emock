"use strict";

const joi = require("joi");
const createRouter = require("@arangodb/foxx/router");
const router = createRouter();
const auth = require("../util/auth");

//COLLECTIONS
const customers = module.context.collection("customer");
const vendors = module.context.collection("vendor");

router.tag("Authentication");
// recieves request => username and password
router
  .post("customer/login", function(req, res) {
    const username = req.body.username;
    const user = customers.firstExample({ username }); //returns doc
    const valid = auth.verify(user ? user.authData : {}, req.body.password);
    if (!valid) res.throw("unauthorized");
    req.session.uid = user._key; // The session middleware  (in main.js) adds session and sessionStorage properties to the request object
    req.sessionStorage.save(req.session);
    res.send({ sucess: true });
  })
  .body(
    joi
      .object({
        username: joi.string().required(),
        password: joi.string().required()
      })
      .required(),
    "Credentials"
  )
  .description("Logs a registered customer in.");

router
  .post("customer/signup", function(req, res) {
    const user = {};
    try {
      user.authData = auth.create(req.body.password); //hash incoming password
      user.username = req.body.username;
      user.email = req.body.email;
      user.time_joined = Date.now();
      user.address = {};
      user.address.city = req.body.address.city;
      user.address.district = req.body.address.district;
      user.perms = [];
      const meta = customers.save(user);
      Object.assign(user, meta);
    } catch (e) {
      res.throw("bad request", e);
    }
    req.session.uid = user._key;
    req.sessionStorage.save(req.session);
    res.send({ success: true });
  })
  .body(
    joi
      .object({
        username: joi.string().required(),
        password: joi.string().required(),
        email: joi.string().email({ minDomainSegments: 2 }),
        address: {
          city: joi.string().required(),
          district: joi.string().required(),
          long: joi.number().optional(),
          lat: joi.number().optional()
        }
      })
      .required(),
    "Credentials"
  )
  .description("Creates a new customer and logs them in.");

/**********************************VENDOR*****************************************/
router
  .post("vendor/login", function(req, res) {
    const username = req.body.username;
    const user = vendors.firstExample({ username }); //returns doc
    const valid = auth.verify(user ? user.authData : {}, req.body.password);
    if (!valid) res.throw("unauthorized");
    req.session.uid = user._key; // The session middleware  (in main.js) adds session and sessionStorage properties to the request object
    req.sessionStorage.save(req.session);
    res.send({ sucess: true });
  })
  .body(
    joi
      .object({
        username: joi.string().required(),
        password: joi.string().required()
      })
      .required(),
    "Credentials"
  )
  .description("Logs a registered vendor in.");

router
  .post("vendor/signup", function(req, res) {
    const user = {};
    try {
      user.authData = auth.create(req.body.password); //hash incoming password
      user.username = req.body.username;
      user.email = req.body.email;
      user.phone_number = req.body.phone_number;
      user.time_joined = Date.now();
      user.perms = [];
      const meta = vendors.save(user);
      Object.assign(user, meta);
    } catch (e) {
      res.throw("bad request", e);
    }
    req.session.uid = user._key;
    req.sessionStorage.save(req.session);

    res.send({ success: true });
  })
  .body(
    joi
      .object({
        username: joi.string().required(),
        password: joi.string().required(),
        email: joi.string().email({ minDomainSegments: 2 }),
        phone_number: joi.number().required()
      })
      .required(),
    "Credentials"
  )
  .description("Creates a new vendor and logs them in.");

router
  .post("/logout", function(req, res) {
    if (req.session.uid) {
      req.session.uid = null;
      req.sessionStorage.save(req.session);
    }
    res.send({ success: true });
  })
  .description("Logs the current user out.");

// router
//   .get("/verifyLogin", function(req, res) {
//     try {
//       const user = customers.document(req.session.uid); //req.session.uid = customer_id
//       res.send({ username: user.username });
//     } catch (e) {
//       res.send({ username: null });
//     }
//   })
//   .description("Returns the currently active username.");
module.exports = router;
