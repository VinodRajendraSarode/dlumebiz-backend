const UserController = require("../controllers/user_controller");

const userRouter = require("express").Router();

userRouter.post("/user/createAccount", UserController.createAccount);
userRouter.post("/user/signIn", UserController.signIn);

module.exports = userRouter;