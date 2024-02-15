"use strict"
const asyncHandler = require("../../helpers/asyncHandler")
const uploadController = require("../../controllers/upload.controller")
const { authenticationV2 } = require("../../auth/authUtils")
const { uploadDisk, uploadMemory } = require("../../configs/multer.config")

const router = require("express").Router()

// router.use(authenticationV2)

router.post("/product", asyncHandler(uploadController.uploadFile))
router.post(
    "/product/thumb",
    uploadDisk.single("file"),
    asyncHandler(uploadController.uploadFileThumb)
)
router.post(
    "/product/multi",
    uploadDisk.array("files", 3),
    asyncHandler(uploadController.uploadImageFromLocalFiles)
)
//upload s3
router.post(
    "/product/bucket",
    uploadMemory.single("file"),
    asyncHandler(uploadController.uploadImageFromLocalS3)
)

module.exports = router
