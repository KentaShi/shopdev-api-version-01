"use strict"
const amqp = require("amqplib")

async function consumerOrderedMessage() {
    const connection = await amqp.connect("amqp://guest:1234@localhost")
    const channel = await connection.createChannel()

    const queueName = "ordered-queue-message"
    await channel.assertQueue(queueName, { durable: true })

    // set prefetch to 1: ensure that only one message at a time
    channel.prefetch(1)

    channel.consume(queueName, (msg) => {
        const message = msg.content.toString()

        setTimeout(() => {
            console.log(`Proccessing: `, message)
            channel.ack(msg)
        }, Math.random() * 1000)
    })
}

consumerOrderedMessage().catch((err) => console.error(err))
