const db = require("../models");
const User = db.User;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const apiResponse = require("../utils/apiResponse");
const logger = require("../utils/logger");

// Register a new user
exports.signup = async (req, res) => {
  try {
    // Create a new user
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      address: req.body.address,
      role: req.body.role || "Normal User",
    });

    // console.log(user);

    logger.info(`User created: ${user.email}`);
    apiResponse.successResponse(
      res,
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      "User registered successfully!"
    );
  } catch (err) {
    logger.error(`Error in signup: ${err.message}`);
    apiResponse.serverErrorResponse(res, err.message);
  }
};

// Login user
exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      logger.warn(
        `Login attempt failed for email: ${req.body.email} - User not found`
      );
      return apiResponse.notFoundResponse(res, "User not found.");
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      logger.warn(
        `Login attempt failed for user: ${user.email} - Invalid password`
      );
      return apiResponse.unauthorizedResponse(res, "Invalid password!");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 86400, // 24 hours
    });

    logger.info(`User logged in: ${user.email}`);
    apiResponse.successResponse(res, {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken: token,
    });
  } catch (err) {
    logger.error(`Error in signin: ${err.message}`);
    apiResponse.serverErrorResponse(res, err.message);
  }
};
