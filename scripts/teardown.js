"use strict";
const db = require("@arangodb").db;
const documentCollections = [
  "customer",
  "customer_orders",
  "costumer_rating",
  "driver",
  "products",
  "stores"
];
const edgeCollections = [];

for (const localName of documentCollections) {
  const qualifiedName = module.context.collectionName(localName);
  db._drop(qualifiedName);
}

for (const localName of edgeCollections) {
  const qualifiedName = module.context.collectionName(localName);
  db._drop(qualifiedName);
}
