const db = require("../models");
const Store = db.Store;
const Rating = db.Rating;
const apiResponse = require("../utils/apiResponse");
const logger = require("../utils/logger");

// Create a new store
exports.createStore = async (req, res) => {
  try {
    const {name, email, address, ownerId} = req.body
     // Validate required fields
     if (!name || !email || !address) {
      logger.warn('Validation failed - Missing required fields');
      return apiResponse.badRequestResponse(res, 'Name, email, and address are required');
    }

    const store = await Store.create({
      name,
      email,
      address,
      ownerId : ownerId || req.userId, 
    });

    logger.info(`Store created: ${store.name}`);
    apiResponse.successResponse(res, store, "Store created successfully!");
  } catch (err) {
    logger.error(`Error in createStore: ${err.message}`);
    apiResponse.serverErrorResponse(res, err.message);
  }
};

// Get all stores
exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      attributes: [
        'id',
        'name',
        'email',
        'address',
        'createdAt',
        // Calculate average rating directly in SQL
        [db.sequelize.literal('(SELECT COALESCE(AVG(rating), 0) FROM ratings WHERE ratings.storeId = Store.id)'), 'averageRating'],
        // Count ratings directly in SQL
        [db.sequelize.literal('(SELECT COUNT(*) FROM ratings WHERE ratings.storeId = Store.id)'), 'ratingCount']
      ],
      
      include: req.query.includeOwner
        ? [
            {
              model: db.User,
              as: "owner",
              attributes: ["id", "name", "email"],
            },
          ]
        : [],
      where: {
        ...(req.query.search && {
          [db.Sequelize.Op.or]: [
            { name: { [db.Sequelize.Op.like]: `%${req.query.search}%` } },
            { address: { [db.Sequelize.Op.like]: `%${req.query.search}%` } },
          ],
        }),
      },
      order: [["createdAt", "DESC"]],
    });

    logger.info(`Retrieved all stores`);
    apiResponse.successResponse(res, stores);
  } catch (err) {
    logger.error(`Error in getAllStores: ${err.message}`);
    apiResponse.serverErrorResponse(res, err.message);
  }
};

// Get store by ID
exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id, {
      attributes: ["id", "name", "email", "address", "createdAt"],
      include: [
        {
          model: db.User,
          as: "owner",
          attributes: ["id", "name", "email"],
        },
        {
          model: db.Rating,
          as: "ratings",
          attributes: ["id", "rating", "createdAt"],
          include: [
            {
              model: db.User,
              as: "user",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

    if (!store) {
      logger.warn(`Store not found with id: ${req.params.id}`);
      return apiResponse.notFoundResponse(res, "Store not found");
    }

    // Calculate average rating
    const ratings = store.ratings || [];
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating.rating, 0) /
          ratings.length
        : 0;

    const storeWithRating = {
      ...store.get({ plain: true }),
      averageRating: parseFloat(avgRating.toFixed(2)),
      totalRatings: ratings.length,
    };

    logger.info(`Retrieved store with id: ${req.params.id}`);
    apiResponse.successResponse(res, storeWithRating);
  } catch (err) {
    logger.error(`Error in getStoreById: ${err.message}`);
    apiResponse.serverErrorResponse(res, err.message);
  }
};

// Update store
exports.updateStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    console.log(req.body)

    if (!store) {
      logger.warn(`Store not found with id: ${req.params.id}`);
      return apiResponse.notFoundResponse(res, "Store not found");
    }

    console.log(store.ownerId)
    // Check if the user is the owner or admin
    if (
      store.ownerId !== req.body.userId &&
      req.body.userRole !== "System Administrator"
    ) {
      logger.warn(
        `Unauthorized attempt to update store by user: ${req.userId}`
      );
      return apiResponse.unauthorizedResponse(
        res,
        "You are not authorized to update this store"
      );
    }

    const updatedStore = await store.update({
      name: req.body.name || store.name,
      email: req.body.email || store.email,
      address: req.body.address || store.address,
    });

    logger.info(`Updated store with id: ${req.params.id}`);
    apiResponse.successResponse(
      res,
      updatedStore,
      "Store updated successfully"
    );
  } catch (err) {
    logger.error(`Error in updateStore: ${err.message}`);
    apiResponse.serverErrorResponse(res, err.message);
  }
};

// Delete store
exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);

    if (!store) {
      logger.warn(`Store not found with id: ${req.params.id}`);
      return apiResponse.notFoundResponse(res, "Store not found");
    }
      console.log(req.body)
    // Check if the user is the owner or admin
    if (
      store.ownerId !== req.userId &&
      req.body.userRole !== "System Administrator"
    ) {
      logger.warn(
        `Unauthorized attempt to delete store by user: ${req.userId}`
      );
      return apiResponse.unauthorizedResponse(
        res,
        "You are not authorized to delete this store"
      );
    }

    await store.destroy();
    logger.info(`Deleted store with id: ${req.params.id}`);
    apiResponse.successResponse(res, null, "Store deleted successfully");
  } catch (err) {
    logger.error(`Error in deleteStore: ${err.message}`);
    apiResponse.serverErrorResponse(res, err.message);
  }
};

// Get stores owned by the current user
exports.getMyStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      where: { ownerId: req.userId },
      attributes: ["id", "name", "email", "address", "createdAt"],
      include: [
        {
          model: db.Rating,
          as: "ratings",
          attributes: ["id", "rating", "createdAt"],
          include: [
            {
              model: db.User,
              as: "user",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

    // Calculate average ratings for each store
    const storesWithRatings = stores.map((store) => {
      const ratings = store.ratings || [];
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, rating) => sum + rating.rating, 0) /
            ratings.length
          : 0;

      return {
        ...store.get({ plain: true }),
        averageRating: parseFloat(avgRating.toFixed(2)),
        totalRatings: ratings.length,
      };
    });

    logger.info(`Retrieved stores for user: ${req.userId}`);
    apiResponse.successResponse(res, storesWithRatings);
  } catch (err) {
    logger.error(`Error in getMyStores: ${err.message}`);
    apiResponse.serverErrorResponse(res, err.message);
  }
};

// Get store statistics
exports.getStoreStats = async (req, res) => {
  try {
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    const avgRating = await Rating.findOne({
      attributes: [
        [db.Sequelize.fn("AVG", db.Sequelize.col("rating")), "average"],
      ],
      raw: true,
    });

    logger.info(`Retrieved store statistics`);
    apiResponse.successResponse(res, {
      totalStores,
      totalRatings,
      averageRating: parseFloat(avgRating.average || 0).toFixed(2),
    });
  } catch (err) {
    logger.error(`Error in getStoreStats: ${err.message}`);
    apiResponse.serverErrorResponse(res, err.message);
  }
};
