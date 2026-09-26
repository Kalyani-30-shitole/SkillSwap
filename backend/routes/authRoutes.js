const express = require("express");
const { registerUser, loginUser, getProfile } = require('../controllers/authController');

const {updateSkills} = require("../controllers/profileController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/skills", protect, updateSkills);
module.exports = router;
