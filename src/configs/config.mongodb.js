"use strict"

// level 0
// const config = {
//     app: {
//         port: 3000,
//     },
//     db: {
//         host: "localhost",
//         port: 27017,
//         name: "db",
//     },
// }

// development
const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3001,
    },
    db: {
        host: process.env.DEV_DB_HOST || "localhost",
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || "shopDev",
    },
}
// production
const product = {
    app: {
        port: process.env.PRODUCT_APP_PORT || 3001,
    },
    db: {
        host: process.env.PRODUCT_DB_HOST || "localhost",
        port: process.env.PRODUCT_DB_PORT || 27017,
        name: process.env.PRODUCT_DB_NAME || "shopProduct",
    },
}

const config = { dev, product }

const ENV = process.env.NODE_ENV || "dev"

module.exports = config[ENV]
