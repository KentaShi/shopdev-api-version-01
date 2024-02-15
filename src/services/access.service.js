"use strict"

const shopModel = require("../models/shop.model")
const bcrypt = require("bcrypt")
const crypto = require("node:crypto")
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const {
    BadRequestError,
    AuthFailureError,
    ForBiddenError,
} = require("../core/error.response")
const { findByEmail } = require("./shop.service")

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
}

class AccessService {
    //Check this token used?
    static handlerRefreshToken = async (refreshToken) => {
        // check xem token nay da duoc su dung chua
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(
            refreshToken
        )
        if (foundToken) {
            // decode token xem ai login
            const { userId, email } = await verifyJWT(
                refreshToken,
                foundToken.privateKey
            )
            console.log({ userId, email })
            //xoa tat ca token trong keystore
            await KeyTokenService.deleteKeyByUserId(userId)
            throw new ForBiddenError(
                "Something went wrong! please try logging in again"
            )
        }

        const holderToken = await KeyTokenService.findByRefreshToken(
            refreshToken
        )
        if (!holderToken) throw new AuthFailureError("Shop not registered!")
        // verify token
        const { userId, email } = await verifyJWT(
            refreshToken,
            holderToken.privateKey
        )
        console.log("[2]-->", { userId, email })
        // check foung shop
        const foundShop = await findByEmail({ email })
        if (!foundShop) {
            throw new AuthFailureError("Shop not registered!!")
        }

        // create 1 cap tokens moi
        const tokens = await createTokenPair(
            { userId, email },
            holderToken.publicKey,
            holderToken.privateKey
        )
        // update tokens
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokensUsed: refreshToken,
            },
        })
        return { user: { userId, email }, tokens }
    }

    static handlerRefreshTokenV2 = async ({ keyStore, user, refreshToken }) => {
        const { userId, email } = user
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyByUserId(userId)
            throw new ForBiddenError(
                "Something went wrong! please try logging in again"
            )
        }

        if (keyStore.refreshToken !== refreshToken) {
            throw new AuthFailureError("Shop not registered!")
        }

        // check foung shop
        const foundShop = await findByEmail({ email })
        if (!foundShop) {
            throw new AuthFailureError("Shop not registered!!")
        }
        // create 1 cap tokens moi
        const tokens = await createTokenPair(
            { userId, email },
            keyStore.publicKey,
            keyStore.privateKey
        )
        // update tokens
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokensUsed: refreshToken,
            },
        })
        return { user, tokens }
    }

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        console.log({ delKey })
        return delKey
    }
    /*
        1- Check email in database
        2- match password
        3- create AT and RT and save
        4- generate tokens
        5- get data return login
    */

    static login = async ({ email, password, refreshToken = null }) => {
        // 1-
        const foundShop = await findByEmail({ email })
        if (!foundShop) {
            throw new BadRequestError("Couldn't find this shop")
        }
        //2-
        const match = bcrypt.compare(password, foundShop.password)
        if (!match) {
            throw new AuthFailureError("Authentication Error")
        }

        //3-
        const privateKey = crypto.randomBytes(64).toString("hex")
        const publicKey = crypto.randomBytes(64).toString("hex")
        //4-
        const tokens = await createTokenPair(
            { userId: foundShop._id, email },
            publicKey,
            privateKey
        )
        //5-
        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        })
        return {
            shop: getInfoData({
                fields: ["_id", "email", "name"],
                object: foundShop,
            }),
            tokens,
        }
    }

    static signUp = async ({ name, email, phone, password }) => {
        // check email exists
        const holderShop = await shopModel.findOne({ email }).lean()
        if (holderShop) {
            throw new BadRequestError(`This shop already register`)
        }
        const passwordHash = await bcrypt.hash(password, 10)
        const newShop = await shopModel.create({
            name,
            email,
            phone,
            password: passwordHash,
            roles: [RoleShop.SHOP],
        })

        if (newShop) {
            // create privateKey, publicKey
            // const { privateKey, publicKey } = crypto.generateKeyPairSync(
            //     "rsa",
            //     {
            //         modulusLength: 4096,
            //         publicKeyEncoding: {
            //             type: "pkcs1",
            //             format: "pem",
            //         },
            //         privateKeyEncoding: {
            //             type: "pkcs1",
            //             format: "pem",
            //         },
            //     }
            // )
            const privateKey = crypto.randomBytes(64).toString("hex")
            const publicKey = crypto.randomBytes(64).toString("hex")

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
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
                { userId: newShop._id, email },
                publicKey,
                privateKey
            )
            console.log("Created token pair::", tokens)

            return {
                code: 201,
                metadata: {
                    shop: getInfoData({
                        fields: ["_id", "email", "name", "phone"],
                        object: newShop,
                    }),
                    tokens,
                },
            }
        }
        return {
            code: 200,
            metadata: null,
        }
    }

    //retry delay
    // if error: every 3s retry fetch data
    // static fetchWithRetry = async (url = "") => {
    //     const response = await fetch(url)
    //     if (response.status < 200 || response.status >= 300) {
    //         setTimeout(async () => {
    //             await this.fetchWithRetry(url)
    //         }, 3000)
    //     }
    //     return response
    // }

    //advanced
    static fetchWithRetry = async (url = "", errorCount = 0) => {
        const MAX_ERROR_COUNT = 3
        const response = await fetch(url)
        if (response.status < 200 || response.status >= 300) {
            if (errorCount <= MAX_ERROR_COUNT) {
                setTimeout(async () => {
                    await this.fetchWithRetry(url, errorCount + 1)
                }, Math.pow(2, errorCount) * 3000 + Math.random() * 1000) // Avoid high requests traffic at the same time
            }
        }
        return response
    }
}

module.exports = AccessService
