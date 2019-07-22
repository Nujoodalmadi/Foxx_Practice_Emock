"use strict";
const sessions = require("../util/sessions");

const tasks = require("@arangodb/tasks");
// Removes all expired sessions from "etest_sessions" collection.
// MODIFY => use Foxx queue or cron
const expired = sessions.storage.prune();
module.exports = expired;

// tasks.register({
//   id: "deleteExpiredSessions",
//   name:
//     "A task that removes all expired sessions from 'etest_sessions' collection.",
//   period: 86400,
//   command: sessions.storage.prune()
// });
