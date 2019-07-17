const errors = require("@arangodb").errors;
const DOC_NOT_FOUND = errors.ERROR_ARANGO_DOCUMENT_NOT_FOUND.code;

const catchE = function(res, e) {
  if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
    throw e;
  }
  res.throw(404, "Something went wrong :))", e);
};

module.exports = catchE;
