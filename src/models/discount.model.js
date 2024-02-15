"use strict"

const { Schema, model } = require("mongoose") // Erase if already required
const DOCUMENT_NAME = "Discount"
const COLLECTION_NAME = "Discounts"
// Declare the Schema of the Mongo model
var discountSchema = new Schema(
    {
        discount_name: {
            type: String,
            required: true,
        },
        discount_description: {
            type: String,
            required: true,
        },
        discount_type: {
            type: String,
            default: "fixed_amount", // or "percentage"
        },
        discount_value: {
            type: Number,
            required: true,
        },
        discount_max_value: {
            type: Number,
            required: true,
        },
        discount_code: {
            type: String, // discount code
            required: true,
        },
        discount_start_date: {
            // ngay bat dau
            type: Date,
            required: true,
        },
        discount_end_date: {
            //ngay ket thuc
            type: Date,
            required: true,
        },
        discount_max_uses: {
            // so luong toi da discount duoc ap dung
            type: Number,
            required: true,
        },
        discount_count_of_used: {
            // so luong discount da su dung
            type: Number,
            required: true,
        },
        discount_list_users_used: {
            // ai su dung
            type: Array,
            default: [],
        },
        discount_max_per_user: {
            // so luong discount toi da cho moi user
            type: Number,
            required: true,
        },
        discount_min_order_value: {
            // don hang toi thieu bao nhieu
            type: Number,
            required: true,
        },
        discount_shopId: {
            type: Schema.Types.ObjectId,
            ref: "Shop",
        },
        discount_is_active: {
            type: Boolean,
            default: true,
        },
        discount_applies_to: {
            type: String,
            required: true,
            enum: ["all", "specific"],
        },
        discount_product_ids: {
            // so san pham duoc ap dung
            type: Array,
            default: [],
        },
    },
    { timestamps: true, collection: COLLECTION_NAME }
)

//Export the model
module.exports = { discount: model(DOCUMENT_NAME, discountSchema) }
