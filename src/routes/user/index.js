"use strict"

const express = require("express")
const router = express.Router()

const asyncHandler = require("../../helpers/asyncHandler")
const userController = require("../../controllers/user.controller")

//continue register via email token

router.post("/new-user", asyncHandler(userController.createNewUser))
router.get(
    "/verify-email",
    asyncHandler(userController.checkRegisterEmailToken)
)

module.exports = router
