"use strict"

const nodemailer = require("nodemailer")

const transport = nodemailer.createTransport({
    host: "email-smtp.ap-southeast-1.amazonaws.com",
    port: 2465,
    secure: true,
    auth: {
        user: "AKIAUCBPEHFIC5UCODSM",
        pass: "BHweBlddxHMXzUG4AbeWlQibUQdoiworpkx5wAI5YsMS",
    },
})

module.exports = { transport }
