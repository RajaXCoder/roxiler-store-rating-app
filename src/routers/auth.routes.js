// src/routers/auth.routes.js
const {
  checkDuplicateEmail,
  checkRolesExisted,
} = require("../middlewares/verifySignUp");
const controller = require("../controllers/auth.controller");
const apiResponse = require("../utils/apiResponse");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [checkDuplicateEmail, checkRolesExisted],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
};
