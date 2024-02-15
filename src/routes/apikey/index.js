"use strict"
const apikeyController = require("../../controllers/apikey.controller")
const asyncHandler = require("../../helpers/asyncHandler")

const router = require("express").Router()

router.post("/create", asyncHandler(apikeyController.create))

module.exports = router
