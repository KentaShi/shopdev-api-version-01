"use strict"

const { BadRequestError } = require("../core/error.response")
const { SuccessResponse } = require("../core/success.response")
const { uploadImageFromLocalS3 } = require("../services/upload.aws.service")
const {
    uploadImageFromUrl,
    uploadImageFromLocal,
    uploadImageFromLocalFiles,
} = require("../services/upload.service")

class UploadController {
    uploadFile = async (req, res, next) => {
        new SuccessResponse({
            message: "Upload successful",
            metadata: await uploadImageFromUrl(),
        }).send(res)
    }

    uploadFileThumb = async (req, res, next) => {
        const { file } = req
        if (!file) {
            throw new BadRequestError("File missing")
        }
        new SuccessResponse({
            message: "Upload thumb successful",
            metadata: await uploadImageFromLocal({ path: file.path }),
        }).send(res)
    }

    uploadImageFromLocalFiles = async (req, res, next) => {
        const { files } = req
        if (!files.length) {
            throw new BadRequestError("File missing")
        }
        new SuccessResponse({
            message: "Upload files successful",
            metadata: await uploadImageFromLocalFiles({ files }),
        }).send(res)
    }

    uploadImageFromLocalS3 = async (req, res, next) => {
        const { file } = req
        if (!file) {
            throw new BadRequestError("File missing")
        }
        new SuccessResponse({
            message: "Upload image successful from s3client",
            metadata: await uploadImageFromLocalS3({ file }),
        }).send(res)
    }
}

module.exports = new UploadController()
