"use strict"

const TEMPLATE = require("../models/template.model")
const { htmlEmailToken } = require("../utils/tempEmailHtml")

const newTemplate = async ({
    tem_name,
    tem_id,
    tem_status = "active",
    tem_html,
}) => {
    // 1. check if the template exists
    // 2. create a new template
    const newTemp = await TEMPLATE.create({
        tem_name,
        tem_status,
        tem_id, //unique name
        tem_html: htmlEmailToken(),
    })

    return newTemp
}
const getTemplate = async ({ tem_name }) => {
    return await TEMPLATE.findOne({ tem_name }).lean()
}

module.exports = { newTemplate, getTemplate }
