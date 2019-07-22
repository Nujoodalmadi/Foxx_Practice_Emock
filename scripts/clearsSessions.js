"use strict";
const sessions = require("../util/sessions");
// Removes all expired sessions from "etest_sessions" collection.
// MODIFY => use Foxx queue or cron
const expired = sessions.storage.prune();
module.exports = expired;
