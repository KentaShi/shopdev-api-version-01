"use strict"
const asyncHandler = require("../../helpers/asyncHandler")
const cartController = require("../../controllers/cart.controller")
const { authenticationV2 } = require("../../auth/authUtils")

const router = require("express").Router()

router.post("", asyncHandler(cartController.addToCart))
router.delete("", asyncHandler(cartController.delete))
router.post("/update", asyncHandler(cartController.updateCart))
router.get("", asyncHandler(cartController.getList))

module.exports = router
