import { db } from "../db/db.js"


export async function adminAuth(req, res, next){
     if(!req?.session?.userID){
        return res.status(401).json({error: 'Unauthorized User'})
    }
    
    const userID = req.session.userID

    const adminCheck = await db.query(`
        SELECT * FROM users 
        WHERE id = $1 
        AND role = 'admin'
        `, [userID])


    if(adminCheck.rows.length === 0){
        return res.status(401).json({error: 'Unauthorized User'})
    }

    next()
}