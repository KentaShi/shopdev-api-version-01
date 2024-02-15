"use strict"
const asyncHandler = require("../../helpers/asyncHandler")
const productController = require("../../controllers/product.controller")
const { authenticationV2 } = require("../../auth/authUtils")

const router = require("express").Router()

//search for product by user
router.get(
    "/search/:keySearch",
    asyncHandler(productController.getListSearchProducts)
)
router.get("", asyncHandler(productController.findAllProducts))
router.get("/:product_id", asyncHandler(productController.findProduct))

//authentication
router.use(authenticationV2)
//create product
router.post("/", asyncHandler(productController.createProduct))
//update product
router.patch("/:productId", asyncHandler(productController.updateProduct))
//publish a product
router.post(
    "/publish/:id",
    asyncHandler(productController.publishProductByShop)
)
//unpublish a product
router.post(
    "/unpublish/:id",
    asyncHandler(productController.unPublishProductByShop)
)

//query
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop))
router.get(
    "/published/all",
    asyncHandler(productController.getAllPublishedForShop)
)

module.exports = router
