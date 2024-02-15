"use strict"

const CartService = require("../services/cart.service")

const { CREATED, SuccessResponse } = require("../core/success.response")

class CartController {
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: "Add to Cart successfully",
            metadata: await CartService.addToCart(req.body),
        }).send(res)
    }
    //update + ,- ...
    updateCart = async (req, res, next) => {
        new SuccessResponse({
            message: "Update to Cart successfully",
            metadata: await CartService.addToCartV2(req.body),
        }).send(res)
    }

    delete = async (req, res, next) => {
        new SuccessResponse({
            message: "Delete from Cart successfully",
            metadata: await CartService.deleteUserCartItem(req.body),
        }).send(res)
    }

    getList = async (req, res, next) => {
        new SuccessResponse({
            message: "Get List Cart Succussfully",
            metadata: await CartService.getListUserCart(req.query),
        }).send(res)
    }
}

module.exports = new CartController()
