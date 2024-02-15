"use strict"

const { model, Schema, Types } = require("mongoose") // Erase if already required
const slugify = require("slugify")

const DOCUMENT_NAME = "Product"
const COLLECTION_NAME = "Products"

// Declare the Schema of the Mongo model
const productSchema = new Schema(
    {
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
        product_quantity: {
            type: Number,
            required: true,
        },
        product_type: {
            type: String,
            required: true,
            enum: ["Electronics", "Clothing", "Furniture"],
        },
        product_shop: {
            type: Schema.Types.ObjectId,
            ref: "Shop",
        },
        product_attributes: {
            type: Schema.Types.Mixed,
            required: true,
        },
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

//define the product type = clothing

const clothingSchema = new Schema(
    {
        brand: {
            type: String,
            required: true,
        },
        size: String,
        material: String,
    },
    {
        timestamps: true,
        collection: "Clothes",
    }
)

//define the product type = electronic

const electronicSchema = new Schema(
    {
        manufacturer: {
            type: String,
            required: true,
        },
        model: String,
        color: String,
    },
    {
        timestamps: true,
        collection: "Electronics",
    }
)

//define the product type = furniture

const furnitureSchema = new Schema(
    {
        brand: {
            type: String,
            required: true,
        },
        size: String,
        material: String,
    },
    {
        timestamps: true,
        collection: "Furnitures",
    }
)

//Export the model
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model("Electronic", electronicSchema),
    clothing: model("Clothing", clothingSchema),
    furniture: model("Furniture", furnitureSchema),
}
