const { Kafka } = require("kafkajs")

const kafka = new Kafka({
    clientId: "my-app",
    ssl: true,
    brokers: ["localhost:9092"],
})

const consumer = kafka.consumer({ groupId: "test-group" })
const runConsumer = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic: "test-topic", fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                value: message.value.toString(),
            })
        },
    })
}

runConsumer().catch((err) => console.log("Error in consumer kafka: " + err))
