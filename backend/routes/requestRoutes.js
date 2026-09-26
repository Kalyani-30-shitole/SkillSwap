const express = require("express");

const{
    sendRequest,
    getMyRequests,
    updateRequestStatus
} = require("../controllers/requestController");

const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/test", (req, res) => {
    res.json({
        message: "Request routes are working"
    });
});

router.post("/", protect, sendRequest);
router.get("/",protect, getMyRequests);
router.put("/:id", protect, updateRequestStatus);
module.exports = router;