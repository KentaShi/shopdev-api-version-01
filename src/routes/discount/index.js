"use strict"
const asyncHandler = require("../../helpers/asyncHandler")
const discountController = require("../../controllers/discount.controller")
const { authenticationV2 } = require("../../auth/authUtils")

const router = require("express").Router()

//get amount of discount
router.post("/amount", asyncHandler(discountController.getAllDiscountAmount))
router.get(
    "/list_product_of_code",
    asyncHandler(discountController.getAllProductsBelongToDiscountCode)
)

//authentication
router.use(authenticationV2)

router.post("", asyncHandler(discountController.createDiscountCode))
router.get("/", asyncHandler(discountController.getAllDiscountCodes))

module.exports = router
