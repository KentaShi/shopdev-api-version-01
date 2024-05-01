"use strict"

const _ = require("lodash")
const crypto = require("crypto")
const { Types } = require("mongoose")

const convertToObjectIdMongodb = (id) => new Types.ObjectId(id)

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

// ['a','b'] => {a:1, b:1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((element) => [element, 1]))
}

const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map((element) => [element, 0]))
}

const removeUndefinedObject = (obj) => {
    Object.keys(obj).forEach((key) => {
        if (obj[key] == null) delete obj[key]
    })
    return obj
}

const updateNestedObjectParser = (obj) => {
    console.log(`[1]::`, obj)
    const final = {}
    Object.keys(obj).forEach((key1) => {
        if (typeof obj[key1] === "object" && !Array.isArray(obj[key1])) {
            const res = updateNestedObjectParser(obj[key1])
            Object.keys(res).forEach((key2) => {
                final[`${key1}.${key2}`] = res[key2]
            })
        } else {
            final[key1] = obj[key1]
        }
    })
    console.log(`[2]::`, final)
    return final
}

const randomIamgeName = () => crypto.randomBytes(16).toString("hex")

//replacePlaceholder
const replacePlaceholder = (template, params) => {
    Object.keys(params).forEach((key) => {
        const placeHolder = `{{${key}}}`
        template = template.replace(new RegExp(placeHolder, "g"), params[key])
    })
    return template
}

// random ID
const randomID = (_) => {
    return Math.floor(Math.random() * 899999 + 100000)
}

module.exports = {
    getInfoData,
    getSelectData,
    getUnSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertToObjectIdMongodb,
    randomIamgeName,
    replacePlaceholder,
    randomID,
}
