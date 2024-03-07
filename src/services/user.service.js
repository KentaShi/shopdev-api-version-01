"use strict"
const { ErrorResponse } = require("../core/error.response")
const { SuccessResponse } = require("../core/success.response")
const USER = require("../models/user.model")

const newUser = async ({ email = null, capcha = null }) => {
    // 1. Check email exists
    const user = await USER.findOne({ email }).lean()
    if (user) {
        return new ErrorResponse({ message: "Email already exists" })
    }

    // send token via email user
    return new SuccessResponse({
        message: "Verified email successfully",
        metadata: token,
    })
}

module.exports = { newUser }
