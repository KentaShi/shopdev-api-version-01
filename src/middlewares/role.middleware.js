const AccessControl = require("accesscontrol")

// grant list fetched from DB (to be converted to a valid grants object, internally)
let grantList = [
    {
        role: "admin",
        resource: "profile",
        action: "read:any",
        attributes: "*, !views",
    },
    { role: "shop", resource: "profile", action: "read:own", attributes: "*" },
]
module.exports = new AccessControl(grantList)
