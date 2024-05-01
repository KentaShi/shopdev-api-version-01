"use strict"

const ProductService = require("../services/product.service")
const ProductServiceV2 = require("../services/product.service.xxx")
const { CREATED, SuccessResponse } = require("../core/success.response")
const SpuService = require("../services/spu.service")
const SkuService = require("../services/sku.service")

class ProductController {
    /* SPU, SKU */
    /**
     * @description create a new spu
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    createSpu = async (req, res, next) => {
        try {
            const spu = await SpuService.newSpu({
                ...req.body,
                product_shop: req.user.userId,
            })
            if (spu) {
                new SuccessResponse({
                    message: "Success create spu",
                    metadata: spu,
                }).send(res)
            }
        } catch (error) {
            next(error)
        }
    }

    /**
     * @description find one sku
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */

    findOneSku = async (req, res, next) => {
        try {
            const { sku_id, product_id } = req.query
            new SuccessResponse({
                message: "Success find one sku",
                metadata: await SkuService.oneSku({ sku_id, product_id }),
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    /**
     * @description find one spu
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */

    findOneSpu = async (req, res, next) => {
        try {
            const { product_id } = req.query
            new SuccessResponse({
                message: "Success find one spu",
                metadata: await SpuService.oneSpu({ spu_id: product_id }),
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    /* END SPU, SKU */
    createProduct = async (req, res, next) => {
        // v1
        // new SuccessResponse({
        //     message: "Product created successfully!",
        //     metadata: await ProductService.createProduct(
        //         req.body.product_type,
        //         {
        //             ...req.body,
        //             product_shop: req.user.userId,
        //         }
        //     ),
        // }).send(res)

        //v2
        new SuccessResponse({
            message: "Product created successfully!",
            metadata: await ProductServiceV2.createProduct(
                req.body.product_type,
                {
                    ...req.body,
                    product_shop: req.user.userId,
                }
            ),
        }).send(res)
    }

    //update product
    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Product updated successfully!",
            metadata: await ProductServiceV2.updateProduct(
                req.body.product_type,
                req.params.productId,
                {
                    ...req.body,
                    product_shop: req.user.userId,
                }
            ),
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Product published successfully!",
            metadata: await ProductServiceV2.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId,
            }),
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Product unPublished successfully!",
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId,
            }),
        }).send(res)
    }

    /**
     * @desc Get all draft for shop
     * @param {Number} limit
     * @param {Number} skip
     * @return {JSON}
     */

    // query
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list Draft for shop successfully!",
            metadata: await ProductServiceV2.findAllDraftsForShop({
                product_shop: req.user.userId,
            }),
        }).send(res)
    }
    getAllPublishedForShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list Published for shop successfully!",
            metadata: await ProductServiceV2.findAllPublishedForShop({
                product_shop: req.user.userId,
            }),
        }).send(res)
    }
    getListSearchProducts = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list Published for shop successfully!",
            metadata: await ProductServiceV2.getListSearchProducts(req.params),
        }).send(res)
    }

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: "Find all products successfully!",
            metadata: await ProductServiceV2.findAllProducts(req.query),
        }).send(res)
    }

    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Find a product successfully!",
            metadata: await ProductServiceV2.findProduct({
                product_id: req.params.product_id,
            }),
        }).send(res)
    }
    // end query
}

module.exports = new ProductController()
