const authJwt = require("../middlewares/auth.jwt");
const controller = require("../controllers/user.controller");
const apiResponse = require("../utils/apiResponse");

module.exports = function (app) {
  app.get(
    "/api/users",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getAllUsers
  );

  app.get(
    "/api/users/stats",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getUserStats
  );

  app.get("/api/users/:id", [authJwt.verifyToken], controller.getUserById);

  app.put("/api/users/:id", [authJwt.verifyToken], controller.updateUser);

  app.delete(
    "/api/users/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteUser
  );
};
