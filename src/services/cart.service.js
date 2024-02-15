"use strict"

const { cart } = require("../models/cart.model")
const { BadRequestError, NotFoundError } = require("../core/error.response")
const {
    createUserCart,
    updateUserCartQuantity,
    deleteCartItem,
    getList,
} = require("../models/repositories/cart.repo")
const { getProductById } = require("../models/repositories/product.repo")

/*
    CartService
    - add product to cart [user]
    - reduce product quantity [user]
    - increase product quantity [user]
    - get cart [user]
    - delete cart [user]
    - delete cart item [user]

 */

class CartService {
    static async addToCart({ userId, product = {} }) {
        // check if cart already exists
        const userCart = await cart.findOne({ cart_userId: userId })
        if (!userCart) {
            // create new cart
            return await createUserCart({ userId, product })
        }

        // if cart already exists but it doesnt have product yet
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }

        // if cart already exists and it has product
        return await updateUserCartQuantity({ userId, product })
    }

    // update cart
    /*
        shop_order_ids:[
            {
                shopId,
                item_products:[
                    {
                        productId,
                        price,
                        shopId,
                        old_quantity,
                        quantity
                    }
                ],
                version
            }
        ]
    */

    static async addToCartV2({ userId, shop_order_ids }) {
        const { productId, quantity, old_quantity } =
            shop_order_ids[0]?.item_products[0]
        //check product
        const foundProduct = await getProductById({ productId })
        if (!foundProduct) throw new NotFoundError("Product not found!")

        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId)
            throw new NotFoundError("Product does not belong to the shop!!")

        if (quantity === 0) {
            //delete product
        }

        return await updateUserCartQuantity({
            userId,
            product: { productId, quantity: quantity - old_quantity },
        })
    }

    static async deleteUserCartItem({ userId, productId }) {
        const query = { cart_userId: userId, cart_state: "active" }
        const updateSet = {
            $pull: {
                cart_products: {
                    productId,
                },
            },
        }

        return await deleteCartItem(query, updateSet)
    }
    static async getListUserCart({ userId }) {
        return await getList({ userId })
    }
}

module.exports = CartService
