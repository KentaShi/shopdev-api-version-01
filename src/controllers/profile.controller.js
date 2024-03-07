"use strict"
const { SuccessResponse } = require("../core/success.response")

const dataProfiles = [
    {
        usr_id: 1,
        usr_name: "Name 1",
        usr_avt: "avatar 1",
    },
    {
        usr_id: 2,
        usr_name: "Name 2",
        usr_avt: "avatar 2",
    },
    {
        usr_id: 3,
        usr_name: "Name 3",
        usr_avt: "avatar 3",
    },
]

class ProfileController {
    //admin
    profiles = async (req, res, next) => {
        new SuccessResponse({
            message: "view all profiles",
            metadata: dataProfiles,
        }).send(res)
    }

    //shop
    profile = async (req, res, next) => {
        new SuccessResponse({
            message: "view one profile",
            metadata: {
                usr_id: 2,
                usr_name: "Name 2",
                usr_avt: "avatar 2",
            },
        }).send(res)
    }
}

module.exports = new ProfileController()
