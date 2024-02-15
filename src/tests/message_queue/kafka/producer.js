const { Kafka, logLevel } = require("kafkajs")

const kafka = new Kafka({
    clientId: "my-app",
    ssl: true,
    brokers: ["localhost:9092"],
    logLevel: logLevel.ERROR,
})

const producer = kafka.producer()

const runProducer = async () => {
    await producer.connect()
    await producer.send({
        topic: "test-topic",
        messages: [{ value: "Hello KafkaJS user! My name is Hoang Nam" }],
    })

    await producer.disconnect()
}

runProducer().catch((err) => console.log("Error in kafka: ", err))
