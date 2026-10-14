import { db } from "../db/db.js"

export async function getFeatured(req, res){
    const featured = await db.query(`
        SELECT products.title, products.img, featured.product_id 
        FROM products 
        INNER JOIN
        featured ON featured.product_id = products.id
        `)

    return res.json(featured.rows)
}