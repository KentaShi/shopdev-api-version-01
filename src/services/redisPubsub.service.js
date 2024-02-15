const Redis = require("redis")

class RedisPubSubService {
    constructor() {
        this.subcriber = Redis.createClient()
        this.publisher = Redis.createClient()
        this.subcriber.connect()
        this.publisher.connect()
    }

    // publish(channel, message) {
    //     return new Promise((resolve, reject) => {
    //         this.publisher.publish(channel, message, (err, reply) => {
    //             if (err) {
    //                 reject(err)
    //             } else {
    //                 resolve(reply)
    //             }
    //         })
    //     })
    // }

    // subcribe(channel, callback) {
    //     this.subcriber.subscribe(channel)
    //     this.subcriber.on("message", (subscriberChannel, message) => {
    //         if (channel === subscriberChannel) {
    //             callback(channel, message)
    //         }
    //     })
    // }

    async publish(channel, message) {
        this.publisher.publish(channel, message)
    }

    async subcribe(channel, callback) {
        this.subcriber.subscribe(channel, (message) => callback(message))
    }
}

module.exports = new RedisPubSubService()
