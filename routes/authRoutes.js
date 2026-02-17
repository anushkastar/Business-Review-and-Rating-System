const express = require("express");
const { registerHelper, loginHelper, logoutHelper } = require("../controllers/authController");

const authRouter = express.Router();

authRouter.post("/register", registerHelper);
authRouter.post("/login", loginHelper);
authRouter.post("/logout", logoutHelper);

module.exports = authRouter;