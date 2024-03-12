"use strict"

const TEMPLATE = require("../models/template.model")
const { htmlEmailToken } = require("../utils/tempEmailHtml")

const newTemplate = async ({ tem_name, tem_html }) => {
    // 1. check if the template exists
    // 2. create a new template
    const newTemp = await TEMPLATE.create({
        tem_name, //unique name
        tem_html: htmlEmailToken(),
    })

    return newTemp
}
const getTemplate = async ({ tem_name }) => {
    const template = await TEMPLATE.findOne({ tem_name })

    return template
}

module.exports = { newTemplate, getTemplate }
