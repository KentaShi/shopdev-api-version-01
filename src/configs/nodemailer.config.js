"use strict"

const nodemailer = require("nodemailer")

const transport = nodemailer.createTransport({
    host: "email-smtp.ap-southeast-1.amazonaws.com",
    port: 465,
    secure: true,
    auth: {
        user: "AKIAUCBPEHFIKFFYRBVT",
        pass: "BBi3ZY/gU3GqTUwcLPNpbybXzG0E5lP+ZyuESfHgl3Je",
    },
})

module.exports = transport
