"use strict"

const { model, Schema, Types } = require("mongoose") // Erase if already required
const slugify = require("slugify")

const DOCUMENT_NAME = "Sku"
const COLLECTION_NAME = "Skus"

// Declare the Schema of the Mongo model
const skuSchema = new Schema(
    {
        sku_id: {
            type: String,
            required: true,
            unique: true,
        },
        sku_tier_idx: {
            type: Array,
            default: [0],
        },
        /*
            color = [red, green, blue] => [0,1,2]
            size = [S, M, L] => [0,1,2]
            
            => red + M = [0,1]
        */
        sku_default: {
            type: Boolean,
            default: false,
        },
        sku_slug: {
            type: String,
            default: "",
        },
        sku_sort: {
            type: Number,
            default: 0,
        },
        sku_price: {
            type: String,
            required: true,
        },
        sku_stock: {
            type: Number,
            default: 0,
        },
        product_id: {
            type: String,
            required: true,
        },
        isDraft: {
            type: Boolean,
            default: true,
            index: true,
            select: false,
        },
        isPublished: {
            type: Boolean,
            default: false,
            index: true,
            select: false,
        },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true, collection: COLLECTION_NAME }
)

module.exports = model(DOCUMENT_NAME, skuSchema)
