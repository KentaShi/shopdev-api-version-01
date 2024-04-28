"use strict"

const { model, Schema, Types } = require("mongoose") // Erase if already required
const slugify = require("slugify")

const DOCUMENT_NAME = "Spu"
const COLLECTION_NAME = "Spus"

// Declare the Schema of the Mongo model
const spuSchema = new Schema(
    {
        product_id: {
            type: String,
            default: "",
        },
        product_name: {
            type: String,
            required: true,
        },
        product_thumb: {
            type: String,
            required: true,
        },
        product_description: String,
        product_slug: String,
        product_price: {
            type: Number,
            required: true,
        },
        product_category: {
            type: Array,
            default: [],
        },
        product_quantity: {
            type: Number,
            required: true,
        },
        product_shop: {
            type: Schema.Types.ObjectId,
            ref: "Shop",
        },
        product_attributes: {
            type: Schema.Types.Mixed,
            required: true,
        },
        /*
            {
                attribute_id:1234,
                attribute_values: [
                    {
                        value_id:111
                    }
                ]
            }
        */
        product_ratingAverage: {
            type: Number,
            default: 4.5,
            min: [1, "Rating must be above or equal to 1.0"],
            max: [5, "Rating must be under or equal to 5.0"],
            // 4.3434 => 4.3
            set: (val) => Math.round(val * 10) / 10,
        },
        product_variations: {
            type: Array,
            default: [],
        },
        /*
            tier_variation:[
                {
                    name:'color',
                    images:[],
                    options:['red','blue']
                },
                {
                    name:'size',
                    images:[],
                    options:['s','m']
                },
            ]
        */
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

//create index for searching
productSchema.index({ product_name: "text", product_description: "text" })

//document middleware: runs before save() and create()
productSchema.pre("save", function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})

module.exports = model(DOCUMENT_NAME, spuSchema)
