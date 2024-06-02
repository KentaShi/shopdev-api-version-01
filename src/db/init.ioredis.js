"use strict"

const Redis = require("ioredis")

const STATUS_REDIS = {
    CONNECT: "connect",
    END: "end",
    RECONNECT: "reconnecting",
    ERROR: "error",
}

const client = { instanceConnect: null }

const REDIS_CONNECT_TIMEOUT = 10000
const REDIS_ERROR = {
    code: -99,
    message: {
        vn: "Redis het thoi gian",
        en: "Redis connection timed out",
    },
}

const init = ({
    IOREDIS_IS_ENABLE,
    IOREDIS_HOST = process.env.REDIS_CACHE_HOST,
    IOREDIS_PORT = 6379,
}) => {
    if (IOREDIS_IS_ENABLE) {
        const instanceRedis = new Redis({
            host: IOREDIS_HOST,
            port: IOREDIS_PORT,
        })
        client.instanceConnect = instanceRedis
        handleEventConnect({ connectionRedis: instanceRedis })
    }
}
const getIORedis = () => client
const closeIORedis = () => {}

const handleEventConnect = ({ connectionRedis }) => {
    connectionRedis.on(STATUS_REDIS.CONNECT, () => {
        console.log("IORedis connected")
    })
    connectionRedis.on(STATUS_REDIS.END, () => {
        console.log("IORedis disconnected")
    })
    connectionRedis.on(STATUS_REDIS.RECONNECT, () => {
        console.log("IORedis reconnecting")
    })
    connectionRedis.on(STATUS_REDIS.ERROR, (err) => {
        console.log(`IORedis error: ${err}`)
    })
}

module.exports = {
    init,
    getIORedis,
    closeIORedis,
}
