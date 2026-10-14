import { db } from "../db/db.js"

export async function getUser(req, res){

    const userId = req?.session?.userID

        const dbData = await db.query('SELECT * FROM users WHERE id = $1', [userId])

        const user = dbData.rows[0]

        return res.json(user)

}