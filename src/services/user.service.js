"use strict"
const { createTokenPair } = require("../auth/authUtils")
const { ErrorResponse, NotFoundError } = require("../core/error.response")
const { SuccessResponse } = require("../core/success.response")
const UserRepository = require("../models/repositories/user.repo")
const USER = require("../models/user.model")
const { getInfoData } = require("../utils")
const EmailService = require("./email.service")
const KeyTokenService = require("./keyToken.service")
const OTPService = require("./otp.service")
const bcrypt = require("bcrypt")

class UserService {
    static newUser = async ({ email = null, capcha = null }) => {
        // 1. Check email exists
        const user = await USER.findOne({ email }).lean()
        if (user) {
            return new ErrorResponse({ message: "Email already exists" })
        }
        // 2. send token via email user
        const token = await EmailService.sendEmailToken({ email })
        return {
            message: "Verified email successfully",
            metadata: token,
        }
    }
    static checkRegisterEmailToken = async ({ token }) => {
        try {
            const { otp_email: email, otp_token } =
                await OTPService.checkEmailToken({ token })
            if (!email) throw new NotFoundError("Email token not found")

            //check email is existing
            const foundUser = await UserRepository.findUserByEmail({ email })
            if (foundUser) throw new ErrorResponse("Email already exists")

            const passwordHash = await bcrypt.hash(email, 10)
            const newUser = await UserRepository.createUser({
                usr_id: 1,
                usr_name: email,
                usr_slug: "user-slug",
                usr_password: passwordHash,
                usr_role: "",
            })

            if (newUser) {
                const privateKey = crypto.randomBytes(64).toString("hex")
                const publicKey = crypto.randomBytes(64).toString("hex")

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newUser._id,
                    publicKey,
                    privateKey,
                })

                if (!keyStore) {
                    return {
                        code: "xxxx",
                        message: "keyStore error",
                    }
                }

                // create token pair
                const tokens = await createTokenPair(
                    { userId: newUser._id, email },
                    publicKey,
                    privateKey
                )
                console.log("Created token pair::", tokens)

                return {
                    code: 201,
                    metadata: {
                        user: getInfoData({
                            fields: ["usr_id", "usr_email", "usr_name"],
                            object: newUser,
                        }),
                        tokens,
                    },
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = UserService
