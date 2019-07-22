"use strict";
const createAuth = require("@arangodb/foxx/auth");
const auth = createAuth();
module.exports = auth;
// This creates a hash-based password authenticator. You should replace it with something more secure before production
