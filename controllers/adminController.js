import { db } from "../db/db.js";
import {v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    })

export async function getAllOrders(req, res){


    const orders = await db.query(`
        SELECT orders.id AS order_id, orders.total AS total, orders.status AS status, users.username AS Customer
        FROM orders
        INNER JOIN
        users ON users.id = orders.user_id
        `)

    const total_revenue = await db.query(`SELECT SUM(total) FROM orders`)
    const total_orders = await db.query(`SELECT COUNT(*) FROM orders`)
    const total_products = await db.query(`SELECT SUM(quantity) FROM order_items`)

    return res.json({orders: orders?.rows, stats: {
        total_revenue: total_revenue?.rows[0]?.sum,
        total_orders: total_orders?.rows[0]?.count,
        total_products: total_products?.rows[0]?.sum
    }}) 
    
}

export async function updateOrder(req, res){
    let {id} = req.params

    let {status} = req.body

   

    if(!id && !status){
        return res.status(401).json({error: 'Missing request field'})
    }

    id = parseInt(id)
    status = status.toUpperCase()

    if(Number.isNaN(id)){
        return res.status(401).json({error: 'Invalid request'})
    }

    await db.query(`
        UPDATE orders
         SET status = $1 
         WHERE id = $2
         `, [status, id])

    return res.json({message: `Order: #${id} status updated`})


}

export async function getALLProducts(req, res){
    
    const products = await db.query(`SELECT * FROM products`)

    return res.json(products?.rows)
}

export async function addNewProduct(req, res){
    

    let {title, category, description, price, stock} = req.body

    

    if(!title || !category || !description || !price || !stock){
        return res.status(401).json({error: 'Missing fields request'})
    }


    if(!req.file){
        return res.status(401).json({error: 'Invalid request'})
    }

    let file = req.file

    
    

    let results = await cloudinary.uploader.upload(file.path ,{
        folder: 'verde-uploads',
    })

    let url = results.secure_url

    await db.query(`
        INSERT INTO products
         (title, category, description, price, stock, img) 
         VALUES($1, $2, $3, $4, $5, $6) 
         `, [title, category, description, price, stock, url])

    return res.json({message: 'Product created'})
}

export async function editProduct(req, res){
    let {id} = req.params
    let {title, category, description, price, stock} = req.body

    if(!id){
        return res.status(401).json({error: 'Missing request field'})
    }

    id = parseInt(id)
    

    if(Number.isNaN(id)){
        return res.status(401).json({error: 'Invalid request'})
    }

    await db.query(`
        UPDATE products
         SET title = $1, category = $2, description = $3, price = $4, stock = $5 
         WHERE id = $6
         `, [title, category, description, price, stock, id] ) 

    return res.json({message: `Product updated`})
}


export async function deleteProduct(req, res){
    let {id} = req.params

    if(!id){
        return res.status(401).json({error: 'Missing request field'})
    }

    id = parseInt(id)
    

    if(Number.isNaN(id)){
        return res.status(401).json({error: 'Invalid request'})
    }

    await db.query(`DELETE FROM products WHERE id = $1`, [id])

    return res.json({message: 'Product deleted'})
}

export async function getSingleProduct(req, res){
    let {id} = req.params

    
    if(!id){
        return res.status(401).json({error: 'Missing request field'})
    }

    id = parseInt(id)
    

    if(Number.isNaN(id)){
        return res.status(401).json({error: 'Invalid request'})
    }

    const product = await db.query(`
        SELECT * FROM products 
        WHERE id = $1
        `, [id])

    return res.json(product.rows[0])
}

export async function uploadImage(req, res){
     cloudinary.config({
        cloud_name: 'wgnrg4v3',
        api_key: '652759348531428',
        api_secret: 'vLamFwEkXTwBeR7v3bsPDGc3xV8'
    })


    if(!req.file){
        return res.status(401).json({error: 'Invalid request'})
    }

    let file = req.file

    
    

    let results = await cloudinary.uploader.upload(file.path ,{
        folder: 'verde-uploads',
    })

    let url = results.secure_url

    return res.json(url)
    
   


}

