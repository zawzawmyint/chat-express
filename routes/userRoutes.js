const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");
// Load environment variables
require("dotenv").config();
// Load environment variables
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = process.env.MONGODB_DB;

// Login a user
router.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  let username = userName;
  console.log(username);

  try {
    await client.connect();
    const database = client.db(dbName);
    const usersCollection = database.collection("users");

    const user = await usersCollection.findOne({ username });

    if (user) {
      res.status(200).send("Login successful");
    } else {
      res.status(400).send("Invalid credentials");
    }
  } catch (err) {
    res.status(500).send("Error logging in: " + err.message);
  } finally {
    await client.close();
  }
});

// Get all users
router.get("/all", async (req, res) => {
  try {
    await client.connect();
    const database = client.db(dbName);
    const usersCollection = database.collection("users");

    const users = await usersCollection.find({}).toArray();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send("Error fetching users: " + err.message);
    console.error(err.message);
  } finally {
    await client.close();
  }
});

module.exports = router;
