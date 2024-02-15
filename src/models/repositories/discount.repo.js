"use strict"

const { getSelectData, getUnSelectData } = require("../../utils")
const { discount } = require("../discount.model")

const findAllDiscountCodesUnselect = async ({
    limit = 50,
    page = 1,
    sort = "ctime",
    filter,
    unSelect,
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 }
    const documents = await discount
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getUnSelectData(unSelect))
        .lean()

    return documents
}
const findAllDiscountCodesSelect = async ({
    limit = 50,
    page = 1,
    sort = "ctime",
    filter,
    select,
    model,
}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 }
    const documents = await discount
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()

    return documents
}

const checkDiscountExists = async ({ filter }) => {
    return await discount.findOne(filter).lean()
}

module.exports = {
    findAllDiscountCodesUnselect,
    findAllDiscountCodesSelect,
    checkDiscountExists,
}
