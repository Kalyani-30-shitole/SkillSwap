const Message = require("../models/Message");
const ExchangeRequest = require("../models/ExchangeRequest");

const sendMessage = async (req, res) => {
    try {
        const { receiver, message } = req.body;

        if (!receiver || !message || message.trim() === "") {
            return res.status(400).json({
                message: "Receiver and message are required."
            });
        }

        const acceptedRequest = await ExchangeRequest.findOne({
            status: "accepted",
            $or: [
                {
                    sender: req.userId,
                    receiver: receiver
                },
                {
                    sender: receiver,
                    receiver: req.userId
                }
            ]
        });

        if (!acceptedRequest) {
            return res.status(403).json({
                message: "You can message only after the exchange request is accepted."
            });
        }

        const newMessage = await Message.create({
            sender: req.userId,
            receiver: receiver,
            message: message.trim()
        });

        res.status(201).json({
            message: "Message sent successfully.",
            data: newMessage
        });

    } catch (error) {
        console.error("Send message error:", error);

        res.status(500).json({
            message: "Server error while sending message."
        });
    }
};


// Get messages between two users
const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;

        const acceptedRequest = await ExchangeRequest.findOne({
            status: "accepted",
            $or: [
                {
                    sender: req.userId,
                    receiver: userId
                },
                {
                    sender: userId,
                    receiver: req.userId
                }
            ]
        });

        if (!acceptedRequest) {
            return res.status(403).json({
                message: "You can view messages only after the exchange request is accepted."
            });
        }

        const messages = await Message.find({
            $or: [
                {
                    sender: req.userId,
                    receiver: userId
                },
                {
                    sender: userId,
                    receiver: req.userId
                }
            ]
        })
        .sort({ createdAt: 1 });

        res.status(200).json({
            count: messages.length,
            messages
        });

    } catch (error) {
        console.error("Get messages error:", error);

        res.status(500).json({
            message: "Server error while getting messages."
        });
    }
};

const getUnreadMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            receiver: req.userId,
            read: false
        })
            .populate("sender", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: messages.length,
            messages
        });

    } catch (error) {
        console.error("Get unread messages error:", error);

        res.status(500).json({
            message: "Unable to get unread messages."
        });
    }
};


const markMessagesAsRead = async (req, res) => {
    try {
        const { userId } = req.params;

        await Message.updateMany(
            {
                sender: userId,
                receiver: req.userId,
                read: false
            },
            {
                $set: {
                    read: true
                }
            }
        );

        res.status(200).json({
            message: "Messages marked as read."
        });

    } catch (error) {
        console.error("Mark messages as read error:", error);

        res.status(500).json({
            message: "Unable to mark messages as read."
        });
    }
};

module.exports = {
    sendMessage,
    getMessages,
    getUnreadMessages,
    markMessagesAsRead
};