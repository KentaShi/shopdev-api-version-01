"use strict"

const { model, Schema } = require("mongoose")
const DOCUMENT_NAME = "Cart"
const COLLECTION_NAME = "Carts"

const cartSchema = new Schema(
    {
        cart_state: {
            type: String,
            required: true,
            enum: ["active", "complete", "failed", "pending"],
            default: "active",
        },
        cart_products: {
            type: Array,
            default: [],
            required: true,
        },
        cart_count_products: {
            type: Number,
            default: 0,
        },
        cart_userId: {
            type: String,
            required: true,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: {
            createdAt: "createdOn",
            updatedAt: "updatedOn",
        },
    }
)

module.exports = {
    cart: model(DOCUMENT_NAME, cartSchema),
}
