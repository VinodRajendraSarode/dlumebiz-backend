const UserModel = require("../models/user_model");
const bcrypt = require("bcrypt");
const {  sendToken } = require('../middlewares/token');



const UserController = {
    createAccount: async function(req, res){
        
        try {
            const userData = req.body;
            console.log(userData);
            const newUser = new UserModel(userData);
            await newUser.save();

            return res.json({ success: true, data:newUser, message: "User Created Successfully"});         

            
        } catch (err) {
            console.log(err);
             return res.status(500).json({
                success: false,
                message: "Server Error",
                error: err.message || err
            });
        }

    },

    signIn: async function(req, res) {
        try {
            const { username, password} = req.body;
            console.log(req.body);

             const user = await UserModel.findOne({
                $or: [{ email: username }, { phoneNumber: username }]
            });
            console.log("user");

            if(!user){
                return res.status(500).json({
                    success: false,
                    message: "User Not Found",
                });

            }
            console.log(user);
            const passwordMatch =  bcrypt.compareSync(password, user.password);
            if(!passwordMatch){
                return res.status(500).json({
                    success: false,
                    message: "Incorrect Password",
                });

            }
            sendToken(user, 200, res);
            
        } catch (error) {
             return res.status(500).json({
                success: false,
                message: "Server Error",
                error: error.message || error
            });
            
        }
        
    }
};


module.exports = UserController;