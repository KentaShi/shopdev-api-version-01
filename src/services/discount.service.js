"use strict"

const { BadRequestError, NotFoundError } = require("../core/error.response")
const { discount } = require("../models/discount.model")
const { convertToObjectIdMongodb } = require("../utils")
const { findAllProducts } = require("../models/repositories/product.repo")
const {
    findAllDiscountCodesUnselect,
    checkDiscountExists,
} = require("../models/repositories/discount.repo")

/*
    Discount Service

    1. Generate Discount Code [Shop | Admin]
    2. Get Discount amount [User]
    3. Get all discount codes [User | Shop]
    4. Verify discount code [USer]
    5. Delete discount code [Admin | Shop]
    6. Cancel discount code [User]

 */

class DiscountService {
    static async createDiscountCode(payload) {
        const {
            name,
            description,
            type,
            value,
            max_value,
            code,
            start_date,
            end_date,
            max_uses,
            count_of_used,
            list_users_used,
            max_per_user,
            min_order_value,
            shopId,
            is_active,
            applies_to,
            product_ids,
        } = payload

        if (new Date() > new Date(end_date)) {
            throw new BadRequestError("Discount code has expired!")
        }

        if (new Date(start_date) > new Date(end_date))
            throw new BadRequestError("Start date must be before end date!")

        //create index for discount code
        const foundDiscount = await discount
            .findOne({
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId),
            })
            .lean()
        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError("Discount exists!")
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_max_value: max_value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_count_of_used: count_of_used,
            discount_list_users_used: list_users_used,
            discount_max_per_user: max_per_user,
            discount_min_order_value: min_order_value || 0,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === "all" ? [] : product_ids,
        })

        return newDiscount
    }

    static async updateDiscountCode() {}

    /*
        Get all products belong to discount codes
    */

    static async getAllProductsBelongToDiscountCode({
        code,
        shopId,
        userId,
        limit,
        page,
    }) {
        //create index for discount code
        const foundDiscount = await discount
            .findOne({
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId),
            })
            .lean()

        if (!foundDiscount || !foundDiscount.discount_is_active)
            throw new NotFoundError("Discount not found")

        const { discount_applies_to, discount_product_ids } = foundDiscount
        let products
        if (discount_applies_to === "all") {
            //get all products
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ["_id", "product_name"],
            })
        }
        if (discount_product_ids === "specific") {
            //get product_ids
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: "ctime",
                select: ["_id", "product_name"],
            })
        }

        return products
    }

    /*
        Get all discount codes of shop
    */
    static async getAllDiscountCodesByShop({ limit, page, shopId }) {
        const discounts = await findAllDiscountCodesUnselect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true,
            },
            unSelect: ["__v", "discount_shopId"],
        })

        return discounts
    }

    static async getDiscountAmount({ code, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExists({
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId),
            },
        })
        if (!foundDiscount) throw new NotFoundError("Discount not found!")

        const {
            discount_is_active,
            discount_max_uses,
            discount_start_date,
            discount_end_date,
            discount_min_order_value,
            discount_max_per_user,
            discount_list_users_used,
            discount_type,
            discount_value,
        } = foundDiscount
        if (!discount_is_active) throw new NotFoundError("Discount not active!")

        if (!discount_max_uses) throw new NotFoundError("Discount are out!")

        if (
            new Date() < new Date(discount_start_date) ||
            new Date() > new Date(discount_end_date)
        ) {
            throw new NotFoundError("Discount has expired!")
        }

        // check xem code co yeu cau gia tri toi thieu cua don hang hay khong
        let totalOrderPrice = 0
        if (discount_min_order_value > 0) {
            totalOrderPrice = products.reduce((acc, product) => {
                return acc + product.quantity * product.price
            }, 0)
            if (totalOrderPrice < discount_min_order_value) {
                throw new NotFoundError(
                    `Discount requires a minimum order price of ${discount_min_order_value}`
                )
            }
        }

        //check xem user co su dung qua so lan cho phep khong
        if (discount_max_per_user > 0) {
            const foundUserUsedDiscount = discount_list_users_used.find(
                (user) => user.userId === userId
            )
            if (foundUserUsedDiscount) {
                if (foundUserUsedDiscount.length > discount_max_per_user) {
                    throw new NotFoundError(
                        `User has only used this discount in ${discount_max_per_user} time(s)!`
                    )
                }
            }
        }

        //check discount type la fixed_amount hay percentage
        const amount =
            discount_type === "fixed-amount"
                ? discount_value
                : (totalOrderPrice * discount_value) / 100

        return {
            totalOrderPrice,
            discountAmount: amount,
            lastTotalOrderPrice: totalOrderPrice - amount,
        }
    }

    static async deleteDiscountCode({ code, shopId }) {
        const deleted = await discount.findOneAndDelete({
            discount_code: code,
            discount_shopId: shopId,
        })

        return deleted
    }

    //user cancel discount code
    static async cancelDiscountCode({ code, shopId, userId }) {
        const foundDiscount = await checkDiscountExists({
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId),
            },
        })

        if (!foundDiscount) throw new NotFoundError("Discount not exists!")

        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_list_users_used: userId,
            },
            $inc: {
                discount_max_uses: 1,
                discount_count_of_used: -1,
            },
        })

        return result
    }
}

module.exports = DiscountService
