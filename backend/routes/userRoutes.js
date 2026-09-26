const express = require("express");
const{
    getUsersBySkill,
    getProfile,
    updateProfile
} = require('../controllers/userController');

const protect = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/skill/:skill",getUsersBySkill);
router.get("/profile", protect,getProfile);
router.put("/profile",protect, updateProfile);
module.exports = router;