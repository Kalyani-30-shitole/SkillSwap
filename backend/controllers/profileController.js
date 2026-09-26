const User = require("../models/User");

const updateSkills = async(req,res)=>{
    try{
        const {teachSkills, learnSkills}= req.body;
        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                teachSkills,
                learnSkills
            },
            {
                new:true
            }
        ) .select("-password");

        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }

        res.status(200).json({
            message: "Skills updated successfully",
            user
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
module.exports = {
    updateSkills
}