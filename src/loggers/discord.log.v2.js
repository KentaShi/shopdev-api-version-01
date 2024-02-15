"use strict"

const { TOKEN_DISCORD, CHANNELID_DISCORD } = process.env

const { Client, GatewayIntentBits } = require("discord.js")
class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        })
        this.channelId = CHANNELID_DISCORD
        this.client.on("ready", () => {
            console.log(`Logged is as ${this.client.user.tag}`)
        })
        this.client.login(TOKEN_DISCORD)
    }
    sentToFormatCode(logData) {
        const {
            code,
            message = "This is some additional information about the code.",
            title = "Code example",
        } = logData
        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt("00ff00", 16),
                    title,
                    description:
                        "```json\n" + JSON.stringify(code, null, 2) + "\n```",
                },
            ],
        }
        this.sendToMessage(codeMessage)
    }

    sendToMessage(message = "message") {
        const channel = this.client.channels.cache.get(this.channelId)

        if (!channel) {
            console.error(
                "Could not find a channel with id " +
                    this.channelId +
                    " in the cache "
            )
            return
        }

        channel.send(message).catch((e) => console.error(e))
    }
}

//const loggerService = new LoggerService()

module.exports = new LoggerService()
