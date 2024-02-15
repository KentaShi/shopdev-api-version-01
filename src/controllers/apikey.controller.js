"use strict"

const { SuccessResponse } = require("../core/success.response")
const ApikeyService = require("../services/apiKey.service")

class ApikeyController {
    create = async (req, res, next) => {
        console.log("controller")
        new SuccessResponse({
            message: "Create apikey Success",
            metadata: await ApikeyService.createAPIKey(),
        }).send(res)
    }
}

module.exports = new ApikeyController()
