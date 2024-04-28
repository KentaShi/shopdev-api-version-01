"use strict"

const express = require("express")
const router = express.Router()

const asyncHandler = require("../../helpers/asyncHandler")
const userController = require("../../controllers/user.controller")

//continue register via email token

router.post("/new-user", asyncHandler(userController.createNewUser))

module.exports = router
