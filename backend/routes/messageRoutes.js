const express = require("express");

const {
    sendMessage,
    getMessages,
    getUnreadMessages,
    markMessagesAsRead
} = require("../controllers/messageController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Temporary test
router.get("/test", (req, res) => {
    res.json({
        message: "Message routes are working"
    });
});

// Send a message
router.post("/", protect, sendMessage);

//get unread message notifications
router.get("/unread", protect, getUnreadMessages);

// Mark messages as read
router.put("/read/:userId", protect, markMessagesAsRead);

//To Get conversation
router.get("/:userId", protect, getMessages);

module.exports = router;