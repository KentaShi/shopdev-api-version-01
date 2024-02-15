"use strict"

const DiscountService = require("../services/discount.service")

const { CREATED, SuccessResponse } = require("../core/success.response")

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "Discount Code was created successfully!",
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId,
            }),
        }).send(res)
    }
    getAllDiscountCodes = async (req, res, next) => {
        new SuccessResponse({
            message: "Get all discountcodes successfully!",
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId,
            }),
        }).send(res)
    }

    getAllDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: "Get discount Amount successfully!",
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            }),
        }).send(res)
    }

    getAllProductsBelongToDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "Get all product belong to discountcode successfully!",
            metadata: await DiscountService.getAllProductsBelongToDiscountCode({
                ...req.query,
            }),
        }).send(res)
    }
}

module.exports = new DiscountController()
