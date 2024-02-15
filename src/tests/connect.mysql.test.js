const mysql = require("mysql2")
//create connection to pool server
const pool = mysql.createPool({
    host: "localhost",
    user: "kenta",
    password: "1234",
    database: "shopDEV",
})

const batchSize = 100000
const totalSize = 1000000

let currentId = 1
console.time("===timer===")
const insertBatch = async () => {
    const values = []
    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
        const name = `name-${currentId}`
        const age = currentId
        const address = `address-${currentId}`
        values.push([currentId, name, age, address])
        currentId++
    }

    if (!values.length) {
        console.timeEnd("===timer===")
        pool.end((err) => {
            if (err) throw err
            console.log("Connection pool closed successfully")
        })
        return
    }

    const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`
    pool.query(sql, [values], async function (err, result) {
        if (err) throw err
        console.log(`Inserted ${result.affectedRows} records`)
        await insertBatch()
    })
}

insertBatch().catch((err) => console.log(err))

// //perform a sample operation
// pool.query("SELECT * from users", function (err, result) {
//     if (err) throw err
//     console.log(`Query result:`, result)
//     pool.end((err) => {
//         if (err) throw err
//         console.log("connection closed")
//     })
// })
