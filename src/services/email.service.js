"use strict"

const { randomInt } = require("crypto")
const { newOtp } = require("./otp.service")
const { newTemplate } = require("./template.service")

const sendEmailToken = async ({ email }) => {
    try {
        // 1. get token
        const token = await newOtp({ email })

        // 2. get template
        const template = await newTemplate()
    } catch (error) {}
}

module.exports = { sendEmailToken }
