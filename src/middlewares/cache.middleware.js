const { CACHE_PRODUCT } = require("../constants/cache.key")
const { SuccessResponse } = require("../core/success.response")
const { getCacheIO } = require("../models/repositories/cache.repo")

const readCache = async (req, res, next) => {
    const { sku_id } = req.query
    const skuKeyCache = `${CACHE_PRODUCT.SKU}${sku_id}`
    const skuCache = await getCacheIO({ key: skuKeyCache })
    if (!skuCache) return next()
    if (skuCache) {
        return new SuccessResponse({
            message: "Read cache successfully",
            metadata: {
                skuCache: JSON.parse(skuCache),
                loadFrom: "cache middleware",
            },
        }).send(res)
    }
}

module.exports = { readCache }
