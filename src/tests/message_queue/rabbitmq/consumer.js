const amqp = require("amqplib")

const runConsumer = async () => {
    try {
        const connecttion = await amqp.connect("amqp://guest:1234@localhost")
        const channel = await connecttion.createChannel()
        const queueName = "test-topic"

        await channel.assertQueue(queueName, {
            durable: true,
        })
        // send a message to the consumer
        await channel.consume(
            queueName,
            (messages) => {
                console.log("Message received::", messages.content.toString())
            },
            {
                noAck: true,
            }
        )
    } catch (error) {
        console.error(error)
    }
}

runConsumer().catch((err) => console.error(err))
