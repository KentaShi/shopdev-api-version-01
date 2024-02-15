"use strict"

const { Client, GatewayIntentBits } = require("discord.js")

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
})

const key =
    process.env.DISCORD_TOKEN ||
    "MTE0NTYyNzE0NTQ0ODczODg2Nw.Gi2aAm.v2q97-gZ2Uc9kA_xzqErLizoRQi4Do6o5QuO6w"
client.login(key)

client.on("ready", () => {
    console.log(`Logged is as ${client.user.tag}`)
})

client.on("messageCreate", (message) => {
    if (message.author.bot) return
    if (message.content === "Hello") {
        message.reply(`Hello ${message.author.username}, how can i assist?`)
    }
})
