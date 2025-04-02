const db = require("../models");
const User = db.User;
const apiResponse = require("../utils/apiResponse");
const logger = require("../utils/logger");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "createdAt", "address"],
      where: {
        role: req.query.role || { [db.Sequelize.Op.ne]: null },
      },
    });

    logger.info(`Retrieved all users`);
    apiResponse.successResponse(res, users);
  } catch (err) {
    logger.error(`Error in getAllUsers: ${err.message}`);
    apiResponse.serverErrorResponse(res, err.message);
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "name", "email", "address", "role", "createdAt"],
      include: req.query.includeRatings
        ? [
            {
              model: db.Rating,
              as: "ratings",
              attributes: ["id", "rating", "createdAt"],
              include: [
                {
                  model: db.Store,
                  as: "store",
                  attributes: ["id", "name"],
                },
              ],
            },
          ]
        : [],
    });

    if (!user) {
      logger.warn(`User not found with id: ${req.params.id}`);
      return apiResponse.notFoundResponse(res, "User not found");
    }

    logger.info(`Retrieved user with id: ${req.params.id}`);
    apiResponse.successResponse(res, user);
  } catch (err) {
    logger.error(`Error in getUserById: ${err.message}`);
    apiResponse.serverErrorResponse(res, err.message);
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      logger.warn(`User not found with id: ${req.params.id}`);
      return apiResponse.notFoundResponse(res, "User not found");
    }

    // Only allow updating certain fields
    const updatedUser = await user.update({
      name: req.body.name || user.name,
      address: req.body.address || user.address,
    });

    logger.info(`Updated user with id: ${req.params.id}`);
    apiResponse.successResponse(
      res,
      {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        address: updatedUser.address,
        role: updatedUser.role,
      },
      "User updated successfully"
    );
  } catch (err) {
    logger.error(`Error in updateUser: ${err.message}`);
    apiResponse.serverErrorResponse(res, err.message);
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      logger.warn(`User not found with id: ${req.params.id}`);
      return apiResponse.notFoundResponse(res, "User not found");
    }

    await user.destroy();
    logger.info(`Deleted user with id: ${req.params.id}`);
    apiResponse.successResponse(res, null, "User deleted successfully");
  } catch (err) {
    logger.error(`Error in deleteUser: ${err.message}`);
    apiResponse.serverErrorResponse(res, err.message);
  }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalAdmins = await User.count({
      where: { role: "System Administrator" },
    });
    const totalStoreOwners = await User.count({
      where: { role: "Store Owner" },
    });
    const totalNormalUsers = await User.count({
      where: { role: "Normal User" },
    });

    logger.info(`Retrieved user statistics`);
    apiResponse.successResponse(res, {
      totalUsers,
      totalAdmins,
      totalStoreOwners,
      totalNormalUsers,
    });
  } catch (err) {
    logger.error(`Error in getUserStats: ${err.message}`);
    apiResponse.serverErrorResponse(res, err.message);
  }
};
