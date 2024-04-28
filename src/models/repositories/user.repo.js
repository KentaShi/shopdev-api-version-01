"use strict"

const USER = require("../user.model")

class UserRepository {
    static createUser = async ({
        usr_id,
        usr_name,
        usr_slug,
        usr_password,
        usr_role,
    }) => {
        return await USER.create({
            usr_id,
            usr_name,
            usr_slug,
            usr_password,
            usr_role,
        })
    }
    static findUserByEmail = async ({ email }) => {
        return await USER.findOne({ usr_email: email }).lean()
    }
}
module.exports = UserRepository
