"use strict";
const db = require("@arangodb").db;
const documentCollections = [
  "customer",
  "customer_orders",
  "customer_rating",
  "driver",
  "products",
  "stores",
  "sessions",
  "usergroups"
];
const edgeCollections = ["hasPerm", "memberOf"];

for (const localName of documentCollections) {
  const qualifiedName = module.context.collectionName(localName);
  if (!db._collection(qualifiedName)) {
    db._createDocumentCollection(qualifiedName);
  }
}

for (const localName of edgeCollections) {
  const qualifiedName = module.context.collectionName(localName);
  if (!db._collection(qualifiedName)) {
    db._createEdgeCollection(qualifiedName);
  }
}

const users = module.context.collection("customer");
users.ensureIndex({
  type: "hash",
  fields: ["username"],
  unique: true
});
