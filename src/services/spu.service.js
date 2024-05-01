"use strict"

const { NotFoundError } = require("../core/error.response")
const ShopRepository = require("../models/repositories/shop.repo")
const SpuRepository = require("../models/repositories/spu.repo")
const { randomID } = require("../utils")
const SkuService = require("./sku.service")
const _ = require("lodash")

class SpuService {
    static newSpu = async ({
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
        sku_list = [],
    }) => {
        try {
            // 1. check if shop exists
            const foundShop = await ShopRepository.findShopById({
                shop_id: product_shop,
            })
            if (!foundShop) throw new NotFoundError("Shop not found")

            // 2. create a new SPU
            const spu = await SpuRepository.create({
                product_id: randomID(),
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
            // 3. get spu_id add to sku service
            if (spu && sku_list.length) {
                // create skus
                SkuService.newSku({ spu_id: spu.product_id, sku_list })
                    .then(() => {
                        console.log("created skus successfully")
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }

            // 4. sycn data via elastic search (search service)

            // 5. response results object
            return !!spu
        } catch (error) {
            console.log(error)
        }
    }
    static oneSpu = async ({ spu_id }) => {
        try {
            const spu = await SpuRepository.findOne({ spu_id })
            if (!spu) throw new NotFoundError("spu not found")
            const skus = await SkuService.allSkuBySpuId({
                product_id: spu.product_id,
            })
            return {
                spu_info: _.omit(spu, ["__v", "updatedAt"]),
                sku_list: skus.map((sku) =>
                    _.omit(sku, ["__v", "updatedAt", "createdAt", "isDeleted"])
                ),
            }
        } catch (error) {
            return {}
        }
    }
}

module.exports = SpuService
