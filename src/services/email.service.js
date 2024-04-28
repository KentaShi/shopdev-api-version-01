"use strict"

const { randomInt } = require("crypto")
const { newOtp } = require("./otp.service")
const { newTemplate, getTemplate } = require("./template.service")
const { transport } = require("../configs/nodemailer.config")
const { NotFoundError } = require("../core/error.response")
const { replacePlaceholder } = require("../utils")
const OTPService = require("./otp.service")

const sendEmailLinkVerify = async ({
    html,
    toEmail,
    subject = "Verify Register Email",
    text = "verify",
}) => {
    try {
        const mailOptions = {
            from: "kenta.nam.97@gmail.com",
            to: toEmail,
            subject,
            text,
            html,
        }
        console.log(mailOptions)
        transport.sendMail(mailOptions, (err, info) => {
            if (err) {
                return console.log(err)
            }
            console.log("Message sent: " + info.messageId)
        })
    } catch (error) {
        console.log("error send email::", error)
        return error
    }
}

class EmailService {
    static sendEmailToken = async ({ email }) => {
        try {
            // 1. get token
            const otp = await OTPService.newOTP({ email })

            // 2. get template
            const template = await getTemplate({
                tem_name: "HTML EMAIL TOKEN",
            })
            if (!template) {
                throw new NotFoundError("Template not found")
            }
            // 3. replace placeholder with params
            const content = replacePlaceholder(template.tem_html, {
                link_verify: `http://localhost:3001/cgp/welcome-back?token=${otp.otp_token}`,
            })

            // 4. send email
            await sendEmailLinkVerify({
                html: content,
                toEmail: email,
                subject:
                    "Please verify your email address for registration to ShopDEV",
            })
            return 1
        } catch (error) {
            console.log(error)
            return 0
        }
    }
}

module.exports = EmailService
