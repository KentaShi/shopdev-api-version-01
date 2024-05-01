"use strict"

const SKU = require("../sku.model")

class SkuRepository {
    static create = async (sku_list) => {
        return await SKU.create(sku_list)
    }
    static findOne = async ({ sku_id, product_id }) => {
        return await SKU.findOne({ sku_id, product_id }).lean()
    }
    static findAll = async ({ product_id }) => {
        return await SKU.find({ product_id }).lean()
    }
}

module.exports = SkuRepository
