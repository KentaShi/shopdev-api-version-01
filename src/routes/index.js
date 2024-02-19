const { apikey, checkPermission } = require("../auth/checkAuth")

const router = require("express").Router()

//const { pushToLogDiscord } = require("../middlewares")

//add log to discord
// router.use(pushToLogDiscord)

router.get("/checkstatus", (req, res, next) => {
    res.status(200).json({ status: "success", message: "Api OK" })
})
//test api
router.get("/api/test-api", (req, res, next) => {
    res.status(200).json({
        status: "success",
        message: "Api OK",
        metadata: [
            {
                name: "Kentanam",
                age: 18,
            },
        ],
    })
})
router.use("/v1/api/profile", require("./profile"))
//create api key -- test apikey
router.use("/v1/api", require("./apikey"))
//check api key
router.use(apikey)
//check permission
router.use(checkPermission("0000"))
router.use("/v1/api/checkout", require("./checkout"))
router.use("/v1/api/discount", require("./discount"))
// router.use("/v1/api/profile", require("./profile"))
router.use("/v1/api/inventory", require("./inventory"))
router.use("/v1/api/product", require("./product"))
router.use("/v1/api/upload", require("./upload"))
router.use("/v1/api/comment", require("./comment"))
router.use("/v1/api/notification", require("./notification"))
router.use("/v1/api/cart", require("./cart"))
router.use("/v1/api", require("./access"))

module.exports = router
