"use strict"

const { getIORedis } = require("../../db/init.ioredis")
const redisCache = getIORedis().instanceConnect
const setCacheIO = async ({ key, value }) => {
    if (!redisCache) {
        throw new Error("Redis client is not initialized")
    }
    try {
        return await redisCache.set(key, value)
    } catch (error) {
        throw new Error(`${error.message}`)
    }
}
const setCacheIOExpiration = async ({ key, value, experationInSecond }) => {
    if (!redisCache) {
        throw new Error("Redis client is not initialized")
    }
    try {
        return await redisCache.set(key, value, "EX", experationInSecond)
    } catch (error) {
        throw new Error(`${error.message}`)
    }
}
const getCacheIO = async ({ key }) => {
    if (!redisCache) {
        throw new Error("Redis client is not initialized")
    }
    try {
        return await redisCache.get(key)
    } catch (error) {
        throw new Error(`${error.message}`)
    }
}

module.exports = { setCacheIO, setCacheIOExpiration, getCacheIO }
