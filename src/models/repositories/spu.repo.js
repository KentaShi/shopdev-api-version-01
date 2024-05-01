"use strict"

const SPU = require("../spu.model")

class SpuRepository {
    static create = async ({
        product_id,
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_category,
        product_shop,
        product_attributes,
        product_quantity,
        product_variations,
    }) => {
        return await SPU.create({
            product_id,
            product_name,
            product_thumb,
            product_description,
            product_price,
            product_category,
            product_shop,
            product_attributes,
            product_quantity,
            product_variations,
        })
    }

    static findOne = async ({ spu_id }) => {
        return await SPU.findOne({
            product_id: spu_id,
            isPublished: false, // true
        }).lean()
    }
}

module.exports = SpuRepository
