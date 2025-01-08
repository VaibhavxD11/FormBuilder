const express = require("express");
const { registerUser, authUser } = require("../controllers/userController");

const router = express.Router();


// Route to register a new user
router.post("/signup", registerUser);

// Route to authenticate a user
router.post("/login", authUser);

module.exports = router;
