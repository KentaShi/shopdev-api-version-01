"use strict"

const { BadRequestError } = require("../core/error.response")
const { CREATED, SuccessResponse } = require("../core/success.response")
const { ErrorResponse } = require("../core/error.response")
const AccessService = require("../services/access.service")

class AccessController {
    handlerRefreshToken = async (req, res, next) => {
        // new SuccessResponse({
        //     message: "Get Token Success",
        //     metadata: await AccessService.handlerRefreshToken(
        //         req.body.refreshToken
        //     ),
        // }).send(res)

        //V2 fixed
        new SuccessResponse({
            message: "Get Token Success",
            metadata: await AccessService.handlerRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore,
            }),
        }).send(res)
    }

    logout = async (req, res, next) => {
        new SuccessResponse({
            message: "Logout Success",
            metadata: await AccessService.logout(req.keyStore),
        }).send(res)
    }
    login = async (req, res, next) => {
        const { email } = req.body
        if (!email) {
            throw new BadRequestError("Invalid email...")
        }
        const customBody = Object.assign({ requestId: req.requestId }, req.body)
        const { code, ...results } = await AccessService.login(customBody)
        if (code === 200) {
            new SuccessResponse({
                metadata: results,
            }).send(res)
        } else {
            new ErrorResponse("Login Failed", "500")
        }
    }
    signUp = async (req, res, next) => {
        new CREATED({
            message: "Registered successfully",
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10,
            },
        }).send(res)
    }
}

module.exports = new AccessController()
