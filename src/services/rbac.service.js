"use strict"

const RESOURCE = require("../models/resource.model")
const ROLE = require("../models/role.model")

/**
 *
 * @param {string} name
 * @param {string} slug
 * @param {string} description
 */
const createResource = async ({
    name = "profile",
    slug = "p00001",
    description = "",
}) => {
    try {
        // 1. check if the name or slug is already exists
        // 2. create a new resource
        const resource = await RESOURCE.create({
            src_name: name,
            src_slug: slug,
            src_description: description,
        })
        return resource
    } catch (error) {
        return error
    }
}
const resourceList = async ({
    userId = 0,
    limit = 30,
    offset = 0,
    search = "",
}) => {
    try {
        // 1. check admin in middleware function
        // 2. get list of resources
        const resources = await RESOURCE.aggregate([
            {
                $project: {
                    _id: 0,
                    name: "$src_name",
                    slug: "$src_slug",
                    description: "$src_description",
                    resourceId: "$_id",
                    createdAt: 1,
                },
            },
        ])
        return resources
    } catch (error) {
        return []
    }
}
const createRole = async ({
    name = "shop",
    slug = "s00001",
    description = "extend from shop or user",
    grants = [],
}) => {
    try {
        // 1. check role exists

        // 2. create new role
        const role = await ROLE.create({
            role_name: name,
            role_slug: slug,
            role_description: description,
            role_grants: grants,
        })
        return role
    } catch (error) {
        return error
    }
}
const roleList = async ({
    userId = 0,
    limit = 30,
    offset = 0,
    search = "",
}) => {
    try {
        // 1. check user id
        // 2. list roles
        // const roles = await ROLE.find()
        const roles = await ROLE.aggregate([
            {
                $unwind: "$role_grants",
            },
            {
                $lookup: {
                    from: "Resources",
                    localField: "role_grants.resource",
                    foreignField: "_id",
                    as: "resource",
                },
            },
            {
                $unwind: "$resource",
            },
            {
                $project: {
                    role: "$role_name",
                    resource: "$resource.src_name",
                    action: "$role_grants.actions",
                    attributes: "$role_grants.attributes",
                },
            },
            {
                $unwind: "$action",
            },
            {
                $project: {
                    _id: 0,
                    role: 1,
                    resource: 1,
                    action: "$action",
                    attributes: 1,
                },
            },
        ])
        return roles
    } catch (error) {
        return []
    }
}

module.exports = {
    createResource,
    resourceList,
    createRole,
    roleList,
}
