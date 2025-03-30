const users = [
  {
    name: "Raja",
    email: "raja@example.com",
    password: "Raja@123", // Should be hashed in production
    address: "123 Admin Street, Tech City",
    role: "System Administrator",
  },
  {
    name: "Siva",
    email: "siva@example.com",
    password: "Siva@123",
    address: "456 Main Street, New York",
    role: "Normal User",
  },
  {
    name: "Rahul",
    email: "rahul@example.com",
    password: "Rahul@123",
    address: "789 Oak Avenue, Chicago",
    role: "Normal User",
  },
  {
    name: "Giri",
    email: "giri@example.com",
    password: "Giri@123",
    address: "321 Pine Road, Los Angeles",
    role: "Store Owner",
  },
  {
    name: "Kabil",
    email: "kabil@example.com",
    password: "Kabil@123",
    address: "654 Elm Boulevard, Miami",
    role: "Store Owner",
  },
  {
    name: "Anbu",
    email: "anbu@example.com",
    password: "Anbu@123",
    address: "987 Cedar Lane, Seattle",
    role: "Normal User",
  },
];

const stores = [
  {
    name: "Tech Gadgets",
    email: "info@techgadgets.com",
    address: "100 Tech Plaza, Silicon Valley",
    ownerId: 4, // Mike Johnson
  },
  {
    name: "Fashion Boutique",
    email: "contact@fashionboutique.com",
    address: "200 Style Avenue, New York",
    ownerId: 5, // Sarah Williams
  },
  {
    name: "Book Haven",
    email: "support@bookhaven.com",
    address: "300 Knowledge Street, Boston",
    ownerId: 4, // Mike Johnson
  },
  {
    name: "Gourmet Delights",
    email: "hello@gourmetdelights.com",
    address: "400 Food Court, San Francisco",
    ownerId: 5, // Sarah Williams
  },
  {
    name: "Sports World",
    email: "info@sportsworld.com",
    address: "500 Fitness Road, Denver",
    ownerId: 4, // Mike Johnson
  },
];

const ratings = [
  {
    userId: 2, // John Doe
    storeId: 1, // Tech Gadgets
    rating: 5,
  },
  {
    userId: 3, // Jane Smith
    storeId: 1, // Tech Gadgets
    rating: 4,
  },
  {
    userId: 6, // David Brown
    storeId: 1, // Tech Gadgets
    rating: 3,
  },
  {
    userId: 2, // John Doe
    storeId: 2, // Fashion Boutique
    rating: 4,
  },
  {
    userId: 3, // Jane Smith
    storeId: 2, // Fashion Boutique
    rating: 5,
  },
  {
    userId: 2, // John Doe
    storeId: 3, // Book Haven
    rating: 3,
  },
  {
    userId: 6, // David Brown
    storeId: 3, // Book Haven
    rating: 4,
  },
  {
    userId: 3, // Jane Smith
    storeId: 4, // Gourmet Delights
    rating: 5,
  },
  {
    userId: 6, // David Brown
    storeId: 5, // Sports World
    rating: 2,
  },
];

const db = require("./src/models");
const bcrypt = require("bcryptjs");

const seedDatabase = async () => {
  try {
    // Clear existing data
    await db.sequelize.sync({ force: true });

    // Hash passwords
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => {
        return {
          ...user,
          password: await bcrypt.hash(user.password, 8),
        };
      })
    );

    // Create users
    await db.User.bulkCreate(usersWithHashedPasswords);

    // Create stores
    await db.Store.bulkCreate(stores);

    // Create ratings
    await db.Rating.bulkCreate(ratings);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
