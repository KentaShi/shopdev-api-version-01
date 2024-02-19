"use strict"

const express = require("express")
const profileController = require("../../controllers/profile.controller")
const { grantAccess } = require("../../middlewares/rbac")
const router = express.Router()

//admin
router.get(
    "/viewAny",
    grantAccess("readAny", "profile"),
    profileController.profiles
)

//shop
router.get(
    "/viewOwn",
    grantAccess("readOwn", "profile"),
    profileController.profile
)

module.exports = router
