const authJwt = require("../middlewares/auth.jwt");
const controller = require("../controllers/rating.controller");
const apiResponse = require("../utils/apiResponse");

module.exports = function (app) {
  app.post("/api/ratings", [authJwt.verifyToken], controller.submitRating);

  app.get(
    "/api/ratings/store/:storeId",
    [authJwt.verifyToken],
    controller.getStoreRatings
  );

  app.get(
    "/api/ratings/user/:userId?",
    [authJwt.verifyToken],
    controller.getUserRatings
  );

  app.delete(
    "/api/ratings/:ratingId",
    [authJwt.verifyToken],
    controller.deleteRating
  );
};
