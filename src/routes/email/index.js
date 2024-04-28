"use strict"

const express = require("express")
const router = express.Router()

const asyncHandler = require("../../helpers/asyncHandler")
const emailController = require("../../controllers/email.controller")

router.post("/new-template", asyncHandler(emailController.newTemplate))

module.exports = router
