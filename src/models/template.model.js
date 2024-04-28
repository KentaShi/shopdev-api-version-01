"use strict"

const { model, Schema } = require("mongoose")

const DOCUMENT_NAME = "Template"
const COLLECTION_NAME = "Templates"

const templateSchema = new Schema(
    {
        tem_id: { type: Number, required: true },
        tem_name: { type: String, required: true },
        tem_status: { type: String, required: true },
        tem_html: { type: String, required: true },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
)

module.exports = model(DOCUMENT_NAME, templateSchema)
