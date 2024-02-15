const amqp = require("amqplib")
const message = "New Product: Product Name"

const runProducer = async () => {
    try {
        const connection = await amqp.connect("amqp://guest:1234@localhost")
        const channel = await connecttion.createChannel()
        const queueName = "test-topic"

        await channel.assertQueue(queueName, {
            durable: true,
        })
        // send a message to the consumer
        await channel.sendToQueue(queueName, Buffer.from(message))
        console.log("message sent to queue:", message)
        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500)
    } catch (error) {
        console.error(error)
    }
}

runProducer().catch((err) => console.error(err))
