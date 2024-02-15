"use strict"
const cloudinary = require("../configs/cloudinary.config")

//1. upload from url image
const uploadImageFromUrl = async () => {
    try {
        const url =
            "https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lkhj6wqzw3agcc_tn"
        const folderName = "product/shops"
        const newFileName = "test"
        const result = await cloudinary.uploader.upload(url, {
            public_id: newFileName,
            folder: folderName,
        })
        console.log(result)
        return result
    } catch (error) {}
}

//upload image from local
const uploadImageFromLocal = async ({ path, folderName = "product/1122" }) => {
    try {
        const result = await cloudinary.uploader.upload(path, {
            public_id: "thumb",
            folder: folderName,
        })
        console.log(result)
        return {
            image_url: result.secure_url,
            thumb_url: await cloudinary.url(result.public_id, {
                width: 100,
                height: 100,
                format: "jpg",
            }),
            shopId: 1122,
        }
    } catch (error) {}
}

const uploadImageFromLocalFiles = async ({
    files,
    folderName = "product/1122",
}) => {
    try {
        console.log(`files:`, files, folderName)
        if (!files.length) return
        const uploadedUrls = []
        for (const file of files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: folderName,
            })
            uploadedUrls.push({
                image_url: result.secure_url,
                thumb_url: await cloudinary.url(result.public_id, {
                    width: 100,
                    height: 100,
                    format: "jpg",
                }),
                shopId: 1122,
            })
        }

        return uploadedUrls
    } catch (error) {
        console.error("Error uploading files", error)
    }
}

module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocal,
    uploadImageFromLocalFiles,
}
