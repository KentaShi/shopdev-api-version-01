const express = require("express")
const morgan = require("morgan")
const helmet = require("helmet")
const dotenv = require("dotenv")
const cors = require("cors")
const bodyParser = require("body-parser")
const compression = require("compression")
const app = express()
const { checkOverload } = require("./helpers/check.connect")

require("dotenv").config()

// init middlewares

const corsOptions = {
    origin: "http://localhost:3000", // Replace with your Next.js app's URL
    methods: "*",
    allowedHeaders: "*",
}
app.use(cors(corsOptions))
app.use(morgan("dev"))
app.use(helmet())
//app.use(bodyParser.json())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// init db
require("./db/init.mongodb")
//check over load in mongodb
//checkOverload()

//test pubsub redis
// require("./tests/inventory.test")
// const productTest = require("./tests/product.test")
// productTest.purchaseProduct("product:001", 10)
// init routers
app.use("", require("./routes"))
// handling errors
app.use((req, res, next) => {
    const error = new Error("Not Found")
    error.status = 404
    next(error)
})
app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: "error!!",
        code: statusCode,
        message: error.message || "Internal Server Error",
    })
})

module.exports = app
