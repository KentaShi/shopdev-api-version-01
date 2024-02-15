"use strict"
const asyncHandler = require("../../helpers/asyncHandler")
const inventoryController = require("../../controllers/inventory.controller")
const { authenticationV2 } = require("../../auth/authUtils")

const router = require("express").Router()

router.use(authenticationV2)
router.post("", asyncHandler(inventoryController.addStockToInventory))

module.exports = router
