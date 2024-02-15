"use strict"
const jwt = require("jsonwebtoken")
const asyncHandler = require("../helpers/asyncHandler")
const { AuthFailureError, NotFoundError } = require("../core/error.response")
const { findByUserId } = require("../services/keyToken.service")

const HEADER = {
    API_KEY: "x-api-key",
    CLIENT_ID: "x-client-id",
    AUTHORIZATION: "authorization",
    REFRESHTOKEN: "x-rtoken-id",
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // access token
        const accessToken = await jwt.sign(payload, publicKey, {
            expiresIn: "2 days",
        })
        // refresh token
        const refreshToken = await jwt.sign(payload, privateKey, {
            expiresIn: "7 days",
        })

        jwt.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error("error verifying::", err)
            } else {
                console.log("decode verified::", decode)
            }
        })
        return { accessToken, refreshToken }
    } catch (error) {}
}

const authentication = asyncHandler(async (req, res, next) => {
    /*
        1 - check userId missing
        2 - get access token
        3 - verify access token
        4 - check user in dbs
        5 - check keyStore with this userId
        6 - ok ? return next()
    */
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) {
        throw new AuthFailureError("Invalid request")
    }
    // 2
    const keyStore = await findByUserId(userId)
    if (!keyStore) {
        throw new NotFoundError("Not found keyStore")
    }
    //3
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) {
        throw new AuthFailureError("Invalid request")
    }
    try {
        const decodeUser = jwt.verify(accessToken, keyStore.publicKey)
        //console.log({ userId, decodeUser })
        if (userId !== decodeUser.userId) {
            throw new AuthFailureError("Invalid userId")
        }
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})

const authenticationV2 = asyncHandler(async (req, res, next) => {
    /*
        1 - check userId missing
        2 - get access token
        3 - verify access token
        4 - check user in dbs
        5 - check keyStore with this userId
        6 - ok ? return next()
    */
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) {
        throw new AuthFailureError("Invalid request")
    }
    // 2
    const keyStore = await findByUserId(userId)
    if (!keyStore) {
        throw new NotFoundError("Not found keyStore")
    }
    //3
    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            const decodeUser = jwt.verify(refreshToken, keyStore.privateKey)
            //console.log({ userId, decodeUser })
            if (userId !== decodeUser.userId) {
                throw new AuthFailureError("Invalid userId")
            }
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw error
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) {
        throw new AuthFailureError("Invalid request")
    }
    try {
        const decodeUser = jwt.verify(accessToken, keyStore.publicKey)
        //console.log({ userId, decodeUser })
        if (userId !== decodeUser.userId) {
            throw new AuthFailureError("Invalid userId")
        }
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})

const verifyJWT = async (token, keySecret) => {
    return await jwt.verify(token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    authenticationV2,
    verifyJWT,
}
