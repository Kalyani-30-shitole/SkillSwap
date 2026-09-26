const User = require("../models/User");
const getUsersBySkill = async (req,res)=>{
    try{
        const {skill} = req.params;

        const users = await User.find({
            teachSkills: {
                $regex: skill,
                $options: "i"
            }
        }).select("-password");

        res.status(200).json({
            count: users.length,
            users
        });
    }
    catch(error){
        console.log(error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


const updateProfile = async (req, res) => {
    try {
        const { name, about, teachSkills, learnSkills } = req.body;
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        if (name !== undefined) {
            user.name = name;
        }
        if(about !== undefined){
            user.about = about;
        }

        if (teachSkills !== undefined) {
            user.teachSkills = teachSkills;
        }

        if (learnSkills !== undefined) {
            user.learnSkills = learnSkills;
        }
        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            about: updatedUser.about,
            teachSkills: updatedUser.teachSkills,
            learnSkills: updatedUser.learnSkills
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

module.exports = {
    getUsersBySkill,
    getProfile,
    updateProfile
}