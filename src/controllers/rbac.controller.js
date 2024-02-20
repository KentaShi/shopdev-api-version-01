"use strict"

const { SuccessResponse } = require("../core/success.response")
const {
    createRole,
    createResource,
    roleList,
    resourceList,
} = require("../services/rbac.service")

const newRole = async (req, res, next) => {
    new SuccessResponse({
        message: "Created new role",
        metadata: await createRole(req.body),
    }).send(res)
}

const newResource = async (req, res, next) => {
    new SuccessResponse({
        message: "Created new resource",
        metadata: await createResource(req.body),
    }).send(res)
}

const listRoles = async (req, res, next) => {
    new SuccessResponse({
        message: "Get list of roles",
        metadata: await roleList(req.body),
    }).send(res)
}

const listReources = async (req, res, next) => {
    new SuccessResponse({
        message: "Get list of resources",
        metadata: await resourceList(req.body),
    }).send(res)
}
module.exports = {
    newResource,
    newRole,
    listReources,
    listRoles,
}
