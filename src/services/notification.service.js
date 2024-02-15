"use strict"

const { Noti } = require("../models/notification.model")

const pushNotiToSystem = async ({
    type = "SHOP-001",
    receiverId = 1,
    senderId = 2,
    options = {},
}) => {
    let noti_content
    if (type === "SHOP-001") {
        noti_content = `Shop @@@ has already added new product: @@@@`
    } else if (type === "PROMOTION-001") {
        noti_content = `Shop @@@ has already added new voucher: @@@@@`
    }

    const newNoti = await Noti.create({
        noti_type: type,
        noti_content,
        noti_senderId: senderId,
        noti_receiverId: receiverId,
        noti_options: options,
    })

    return newNoti
}

const listNotiByUser = async ({ userId = 1, type = "ALL", isRead = false }) => {
    const match = { noti_receiverId: userId }
    if (type !== "ALL") {
        match["noti_type"] = type
    }

    return await Noti.aggregate([
        {
            $match: match,
        },
        {
            $project: {
                noti_type: 1,
                noti_senderId: 1,
                noti_receiverId: 1,
                noti_content: {
                    $concat: [
                        {
                            $substr: ["$noti_options.shopId", 0, -1],
                        },
                        " has already added new product: ",
                        {
                            $substr: ["$noti_options.product_name", 0, -1],
                        },
                    ],
                },
                createdAt: 1,
                options: 1,
            },
        },
    ])
}

module.exports = { pushNotiToSystem, listNotiByUser }
