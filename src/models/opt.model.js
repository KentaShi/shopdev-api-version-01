"use strict"

const { model, Schema } = require("mongoose")

const DOCUMENT_NAME = "OTPLog"
const COLLECTION_NAME = "OTPLogs"

const otpSchema = new Schema(
    {
        otp_token: { type: String, required: true },
        otp_email: { type: String, required: true },
        otp_status: {
            type: String,
            default: "pending",
            enums: ["active", "pending", "block"],
        },
        expireAt: { type: Date, default: Date.now(), expires: 60 },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
)

module.exports = model(DOCUMENT_NAME, otpSchema)
