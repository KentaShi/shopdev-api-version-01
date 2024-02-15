"use strict"

const mongoose = require("mongoose")
const os = require("os")
const process = require("process")
const _SECOND = 5000
// count the number of connections
const countConnect = () => {
    const numConnections = mongoose.connections.length
    return numConnections
}

// check over load
const checkOverload = () => {
    setInterval(() => {
        const numConnections = countConnect()
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss
        // example maximum number of connections based on cores
        const maxConnections = numCores * 5
        console.log(`Active connections: ${numConnections}`)
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`)
        if (numConnections > maxConnections) {
            console.log("Connections overload detected!")
        }
    }, _SECOND) // Monitor every 5 second
}

module.exports = { countConnect, checkOverload }
