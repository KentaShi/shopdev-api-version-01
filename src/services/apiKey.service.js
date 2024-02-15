"use strict"

const apiKeyModel = require("../models/apiKey.model")
const crypto = require("node:crypto")

const createAPIKey = async () => {
    console.log("do day")
    const apiKey = await apiKeyModel.create({
        key: crypto.randomBytes(64).toString("hex"),
        permissions: ["0000"],
    })
    console.log({ apiKey })
    return apiKey
}

const findById = async (key) => {
    // const testKey = await apiKeyModel.create({
    //     key: crypto.randomBytes(64).toString("hex"),
    //     permissions: ["0000"],
    // })
    // console.log(testKey)
    const objKey = await apiKeyModel.findOne({ key, status: true }).lean()
    return objKey
}

module.exports = { findById, createAPIKey }
