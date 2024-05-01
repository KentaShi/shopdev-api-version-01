"use strict"

const SkuRepository = require("../models/repositories/sku.repo")
const { randomID } = require("../utils")
const _ = require("lodash")

class SkuService {
    static newSku = async ({ spu_id, sku_list }) => {
        try {
            const convertSkuList = sku_list.map((sku) => {
                return {
                    ...sku,
                    product_id: spu_id,
                    sku_id: `${spu_id}.${randomID()}`,
                }
            })
            const skus = await SkuRepository.create(convertSkuList)
            return skus
        } catch (error) {
            return []
        }
    }
    static oneSku = async ({ sku_id, product_id }) => {
        try {
            // TODO: read cached
            const sku = await SkuRepository.findOne({ sku_id, product_id })
            if (sku) {
                // set cached
            }

            return _.omit(sku, ["__v", "updatedAt", "createdAt", "isDeleted"])
        } catch (error) {
            return null
        }
    }
    static allSkuBySpuId = async ({ product_id }) => {
        try {
            const skus = await SkuRepository.findAll({ product_id })
            return skus
        } catch (error) {
            return []
        }
    }
}

module.exports = SkuService
