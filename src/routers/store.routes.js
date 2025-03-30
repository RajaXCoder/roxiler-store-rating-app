const authJwt = require("../middlewares/auth.jwt");
const controller = require("../controllers/store.controller");
const apiResponse = require("../utils/apiResponse");

module.exports = function (app) {
  app.post(
    "/api/stores",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.createStore
  );

  app.get("/api/stores", [authJwt.verifyToken], controller.getAllStores);

  app.get(
    "/api/stores/stats",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getStoreStats
  );

  app.get(
    "/api/stores/my-stores",
    [authJwt.verifyToken, authJwt.isStoreOwner],
    controller.getMyStores
  );

  app.get("/api/stores/:id", [authJwt.verifyToken], controller.getStoreById);

  app.put("/api/stores/:id", [authJwt.verifyToken], controller.updateStore);

  app.delete("/api/stores/:id", [authJwt.verifyToken], controller.deleteStore);
};
