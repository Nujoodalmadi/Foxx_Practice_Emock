const createRouter = require("@arangodb/foxx/router");
const router = createRouter();

//Collections
const ratingColl = module.context.collection("customer_rating");

router
  .post("/rating", function(req, res) {
    const data = req.body;
    const meta = ratingColl.save(req.body);
    res.send(Object.assign(data, meta));
  })
  .body(joi.object().required(), "New shop to be stored")
  .summary("Retrieve all documents")
  .description("Retrieves all documents");

module.exports = router;
