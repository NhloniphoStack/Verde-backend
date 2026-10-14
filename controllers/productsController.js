
import {db} from '../db/db.js'

export async function getProducts(req, res){
    let {category} = req.query
     let query = `SELECT * FROM products WHERE is_active = TRUE`
     let params = []


     if(category){
        query += ` AND category = $1`
        params.push(category)
     }

    const products = await db.query(query, params)

    return res.json(products?.rows)
    
}


export async function getProduct(req, res){
    let {id} = req.params || {}

    if(!id){
      return res.status(401).json({error: 'Missing request'})
    }

    id = parseInt(id)

    if(Number.isNaN(id)){
        return res.status(401).json({error: 'Invalid request'})
    }


    const product = await db.query(`
        SELECT * FROM products 
        WHERE id = $1
        `, [id])

    return res.json(product?.rows[0])
}