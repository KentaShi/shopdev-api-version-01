"use strict"

const redis = require("redis")

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

const initRedis = () => {
    const instanceRedis = redis.createClient({
        port: 6379,
        host: "127.0.0.1",
    })
    client.instanceConnect = instanceRedis
    handleEventConnect({ connectionRedis: instanceRedis })
}
const getRedis = () => client
const closeRedis = () => {}

const handleEventConnect = ({ connectionRedis }) => {
    connectionRedis.on(STATUS_REDIS.CONNECT, () => {
        console.log("Redis connected")
    })
    connectionRedis.on(STATUS_REDIS.END, () => {
        console.log("Redis disconnected")
    })
    connectionRedis.on(STATUS_REDIS.RECONNECT, () => {
        console.log("Redis reconnecting")
    })
    connectionRedis.on(STATUS_REDIS.ERROR, (err) => {
        console.log(`Redis error: ${err}`)
    })
}

module.exports = {
    initRedis,
    getRedis,
    closeRedis,
}
