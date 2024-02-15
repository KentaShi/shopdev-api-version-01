const redisPubsubService = require("../services/redisPubsub.service")

class InventoryServiceTest {
    constructor() {
        redisPubsubService.subcribe("purchase_events", (message) => {
            console.log(`received message:`, message)
            InventoryServiceTest.updateInventory(message)
        })
    }

    static updateInventory(message) {
        const { productId, quantity } = JSON.parse(message)
        console.log(`Updated inventory ${productId} with quantity ${quantity}`)
    }
}

module.exports = new InventoryServiceTest()
