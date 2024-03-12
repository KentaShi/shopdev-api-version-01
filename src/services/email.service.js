"use strict"

const { randomInt } = require("crypto")
const { newOtp } = require("./otp.service")
const { newTemplate, getTemplate } = require("./template.service")

const sendEmailLinkVerify = () => {}

const sendEmailToken = async ({ email }) => {
    try {
        // 1. get token
        const token = await newOtp({ email })

        // 2. get template
        const template = await getTemplate({
            tem_name: "HTML EMAIL TOKEN",
        })

        // 3. send email
    } catch (error) {}
}

module.exports = { sendEmailToken }
