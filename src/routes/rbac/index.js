"use strict"

const express = require("express")
const router = express.Router()
const {
    newResource,
    newRole,
    listReources,
    listRoles,
} = require("../../controllers/rbac.controller")
const asyncHandler = require("../../helpers/asyncHandler")

router.post("/role", asyncHandler(newRole))
router.get("/roles", asyncHandler(listRoles))

router.post("/resource", asyncHandler(newResource))
router.get("/resources", asyncHandler(listReources))

module.exports = router
