"use strict"

const {
    product,
    clothing,
    electronic,
    furniture,
} = require("../models/product.model")
const { BadRequestError } = require("../core/error.response")
const {
    findAllDraftsForShop,
    findAllPublishedForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
} = require("../models/repositories/product.repo")

const { removeUndefinedObject, updateNestedObjectParser } = require("../utils")
const { insertInventory } = require("../models/repositories/inventory.repo")
const { pushNotiToSystem } = require("./notification.service")

// deinde Factory class to create products

class ProductFactory {
    static productRegistry = {} // {key : class}

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass)
            throw new BadRequestError(`Invalid product type ${type}`)
        return new productClass(payload).createProduct()
    }

    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass)
            throw new BadRequestError(`Invalid product type ${type}`)
        return new productClass(payload).updateProduct(productId)
    }

    //put
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }
    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }
    //end put

    //query
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    static async findAllPublishedForShop({
        product_shop,
        limit = 50,
        skip = 0,
    }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishedForShop({ query, limit, skip })
    }

    static async getListSearchProducts({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }

    static async findAllProducts({
        limit = 50,
        sort = "ctime",
        page = 1,
        filter = { isPublished: true },
    }) {
        return await findAllProducts({
            limit,
            sort,
            page,
            filter,
            select: [
                "product_name",
                "product_price",
                "product_thumb",
                "product_shop",
            ],
        })
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ["__v"] })
    }
}

class Product {
    constructor({
        product_name,
        product_thumb,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes,
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    //create new product
    async createProduct(product_id) {
        const newProduct = await product.create({ ...this, _id: product_id })

        if (newProduct) {
            //add product_stock in inventory collection
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity,
            })

            //push notification to system notification
            pushNotiToSystem({
                type: "SHOP-001",
                receivedId: 1,
                senderId: this.product_shop,
                options: {
                    product_name: this.product_name,
                    shopId: this.product_shop,
                },
            })
                .then((res) => console.log(res))
                .catch((err) => console.log(err))
        }

        return newProduct
    }

    //update product
    async updateProduct(productId, payload) {
        return await updateProductById({ productId, payload, model: product })
    }
}

//define sub-class for different product type Clothing

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if (!newClothing) {
            throw new BadRequestError("Create new clothing error")
        }
        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) {
            throw new BadRequestError("Create new product (clothing) error")
        }
        return newProduct
    }

    async updateProduct(productId) {
        //1. Remove attr has null, undefined value
        const objectParams = removeUndefinedObject(this)
        //2. Determine attributes to update
        if (objectParams.product_attributes) {
            //update child
            await updateProductById({
                productId,
                payload: updateNestedObjectParser(
                    objectParams.product_attributes
                ),
                model: clothing,
            })
        }

        const updateProduct = await super.updateProduct(
            productId,
            updateNestedObjectParser(objectParams)
        )
        return updateProduct
    }
}

//define sub-class for different product type Electronics

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if (!newElectronic) {
            throw new BadRequestError("Create new Electronic error")
        }
        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) {
            throw new BadRequestError("Create new product (Electronic) error")
        }
        return newProduct
    }

    async updateProduct(productId) {
        //1. Remove attr has null, undefined value
        const objectParams = removeUndefinedObject(this)
        //2. Determine attributes to update
        if (objectParams.product_attributes) {
            //update child
            await updateProductById({
                productId,
                payload: updateNestedObjectParser(
                    objectParams.product_attributes
                ),
                model: electronic,
            })
        }

        const updateProduct = await super.updateProduct(
            productId,
            updateNestedObjectParser(objectParams)
        )
        return updateProduct
    }
}

//define sub-class for different product type Furnitures

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if (!newFurniture) {
            throw new BadRequestError("Create new Furniture error")
        }
        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) {
            throw new BadRequestError("Create new product (Furniture) error")
        }
        return newProduct
    }

    async updateProduct(productId) {
        //1. Remove attr has null, undefined value
        const objectParams = removeUndefinedObject(this)
        //2. Determine attributes to update
        if (objectParams.product_attributes) {
            //update child
            await updateProductById({
                productId,
                payload: updateNestedObjectParser(
                    objectParams.product_attributes
                ),
                model: furniture,
            })
        }

        const updateProduct = await super.updateProduct(
            productId,
            updateNestedObjectParser(objectParams)
        )
        return updateProduct
    }
}

// register products types
ProductFactory.registerProductType("Electronic", Electronic)
ProductFactory.registerProductType("Clothing", Clothing)
ProductFactory.registerProductType("Furniture", Furniture)

module.exports = ProductFactory
