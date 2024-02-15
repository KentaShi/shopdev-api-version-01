const amqp = require("amqplib")
const message = "New Product: Product Name"

// const log = console.log
// console.log = function () {
//     log.apply(console, [new Date()].concat(arguments))
// }

const runProducer = async () => {
    try {
        const connection = await amqp.connect("amqp://guest:1234@localhost")
        const channel = await connection.createChannel()

        const notificationExchange = "notificationEx" // notificationEx direct
        const notiQueue = "notificationQueueProcess" // assertQueue
        const notificationExchangeDLX = "notificationExDLX" // notificationExDLX direct
        const notificationRoutingKeyDLX = "notificationRoutingKeyDLX" // notificationRoutingKeyDLX

        // 1. Create Exchange
        await channel.assertExchange(notificationExchange, "direct", {
            durable: true,
        })

        // 2. Create Queue
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false, // allow connections access to queues at the same time
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX,
        })

        // 3. Bind queue
        await channel.bindQueue(queueResult.queue, notificationExchange)

        // 4. Send message
        const msg = "A new product"
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: "10000", // 10s
        })

        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500)
    } catch (error) {
        console.error(error)
    }
}

runProducer().catch((err) => console.error(err))
