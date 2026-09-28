const ExchangeRequest = require("../models/ExchangeRequest");

const sendRequest = async (req,res)=>{
    try{
        const {
            receiver,
            skillOffered,
            skillWanted
        } = req.body;

        if(!receiver || !skillOffered || !skillWanted){
            return res.status(400).json({
                message: "Please provide all request details"
            });
        }

        if (receiver.toString() === req.userId.toString()) {
    return res.status(400).json({
        message: "You cannot send an exchange request to yourself"
    });
}

const existingRequest = await ExchangeRequest.findOne({
    sender: req.userId,
    receiver,
    status: "pending"
});

if (existingRequest) {
    return res.status(400).json({
        message: "You already sent a request to this user"
    });
}

        const request = await ExchangeRequest.create({
            sender: req.userId,
            receiver,
            skillOffered,
            skillWanted,
            read: false
        });
        res.status(201).json({
            message: "Exchange request sent successfully",
            request
        })
    }
    catch(error){
        console.log(error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}

const getMyRequests = async (req, res) => {
    try {
        const requests = await ExchangeRequest.find({
            $or: [
                { sender: req.userId },
                { receiver: req.userId }
            ]
        })
        .populate("sender", "name email teachSkills learnSkills")
        .populate("receiver", "name email teachSkills learnSkills")
        .sort({ createdAt: -1 });

        const formattedRequests = requests.map((request) => ({
            ...request.toObject(),
            type:
                request.sender._id.toString() === req.userId
                    ? "sent"
                    : "received"
        }));

        res.status(200).json({
            count: formattedRequests.length,
            requests: formattedRequests
        });
    }
    catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};
const updateRequestStatus = async(req,res)=>{
    try{
        const {status} =req.body;

        if(!["accepted", "rejected"].includes(status)){
            return res.status(400).json({
                message: "Status must be accepted or rejected"
            })
        }
        const request = await ExchangeRequest.findById(req.params.id);
        if(!request){
            return res.status(400).json({
                message: "Exchange request not found"
            })
        }
        if(request.receiver.toString() !==req.userId){
            return res.status(403).json({
                message: "You are not allowed to update this request"
            })
        }
        if(request.status !=="pending"){
            return res.status(400).json({
                message: "This request has already been processed"
            })
        }
        request.status = status;
        await request.save();

        res.status(200).json({
            message: `Request ${status} successfully`
        })
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}

const getUnreadRequests = async (req, res) => {
    try {
        const requests = await ExchangeRequest.find({
            receiver: req.userId,
            status: "pending",
            read: false
        })
            .populate("sender", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: requests.length,
            requests
        });

    } catch (error) {
        console.error("Get unread requests error:", error);

        res.status(500).json({
            message: "Unable to get unread requests."
        });
    }
};


const markRequestsAsRead = async (req, res) => {
    try {
        await ExchangeRequest.updateMany(
            {
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
            message: "Requests marked as read."
        });

    } catch (error) {
        console.error("Mark requests as read error:", error);

        res.status(500).json({
            message: "Unable to mark requests as read."
        });
    }
};

module.exports = {
    sendRequest,
    getMyRequests,
    updateRequestStatus, 
    getUnreadRequests,
    markRequestsAsRead
}