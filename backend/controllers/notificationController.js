const Message = require("../models/Message");

const getUnreadMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            receiver: req.userId
        })
        .populate("sender", "name")
        .sort({ createdAt: -1 });

        res.status(200).json({
            count: messages.length,
            messages
        });

    } catch (error) {
        console.error("Notification error:", error);

        res.status(500).json({
            message: "Unable to get message notifications."
        });
    }
};

module.exports = {
    getUnreadMessages
};