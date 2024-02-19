"use strict"
const { AuthFailureError } = require("../core/error.response")
const rbac = require("./role.middleware")

/**
 *
 * @param {string} action //read, delete, update,...
 * @param {*} resource //profile, balance,...
 */

const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            const role_name = req.query.role
            const permission = rbac.can(role_name)[action](resource)
            if (!permission.granted) {
                throw new AuthFailureError("You do not have permission")
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}

module.exports = { grantAccess }
