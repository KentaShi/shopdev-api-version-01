"use strict"

const crypto = require("crypto")

const OTP = require("../models/opt.model")
const { NotFoundError } = require("../core/error.response")

const generateTokenRandom = () => {
    const token = crypto.randomInt(0, Math.pow(2, 32))
    return token
}
class OTPService {
    static newOTP = async ({ email }) => {
        const token = generateTokenRandom()
        const newToken = await OTP.create({
            otp_token: token,
            otp_email: email,
        })
        return newToken
    }
    static checkEmailToken = async ({ token }) => {
        const otp = await OTP.findOne({ otp_token: token })
        if (!otp) {
            throw new NotFoundError("Token not found")
        }

        //delete token
        await OTP.deleteOne({ otp_token: token })
        return otp
    }
}

module.exports = OTPService
