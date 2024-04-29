"use strict"

const { SuccessResponse } = require("../core/success.response")
const UserService = require("../services/user.service")

class UserController {
    //new user
    createNewUser = async (req, res, next) => {
        const response = await UserService.newUser({
            email: req.body.email,
        })
        return new SuccessResponse(response).send(res)
    }

    //check user token via email
    checkRegisterEmailToken = async (req, res, next) => {
        const { token } = req.query
        const response = await UserService.checkRegisterEmailToken({ token })
        return new SuccessResponse(response).send(res)
    }
}

module.exports = new UserController()
