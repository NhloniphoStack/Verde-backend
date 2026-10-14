import validator from "validator";
import { db } from "../db/db.js";


export async function addItem(req, res){
    const userID = req?.session?.userID
    let {productid, quantity} = req.body || {}
    
    if(!productid){
        return res.status(400).json({error: 'Invalid request'})
    }

    

   
 
    productid = Number(productid)
 
   if(Number.isNaN(productid)){
     return res.status(400).json({error: 'Invalid request'})
   }

   const existing = await db.query(`SELECT * FROM products WHERE id = $1`, [productid])

   if(existing?.rows?.length === 0){
    return res.status(400).json({error: 'No such item'})
   }

   

    await db.query(`
        INSERT INTO cart_items
         (product_id, user_id, quantity) 
         VALUES ($1, $2, $3)
         ON CONFLICT(product_id, user_id) 
         DO UPDATE 
         SET quantity = cart_items.quantity + EXCLUDED.quantity 
         WHERE cart_items.user_id = $2
         `, [productid, userID, quantity])

    return res.json({message: 'Item added to cart'})

    
}

export async function getCartItems(req, res){
     const userID = req?.session?.userID

    const items = await db.query(`
        SELECT products.title, products.price, products.img, cart_items.quantity, cart_items.product_id 
        FROM products
        INNER JOIN 
        cart_items ON cart_items.product_id = products.id
        WHERE cart_items.user_id = $1
        `, [userID])

    const quantity = await db.query(`
        SELECT SUM(quantity) FROM cart_items
         WHERE user_id = $1`, [userID])

    const subTotal = await db.query(`
        SELECT SUM(products.price * cart_items.quantity) OVER() AS subTotal
        FROM products
        INNER JOIN
        cart_items ON cart_items.product_id = products.id
        WHERE cart_items.user_id = $1
        `, [userID])

    const shipping = 30

    const quantityValue = Number(quantity?.rows[0]?.sum)
    const subTotalValue = Number(subTotal?.rows[0]?.subtotal)

    return res.json({items: items?.rows,
         quantity: quantityValue,
         subTotal:  subTotalValue,
         shipping: shipping,
         total: subTotalValue + shipping
        })
}


export async function removeCartItem(req, res){
    const userID = req?.session?.userID

    let {productid} = req.body  || {}
    
    if(!productid){
         return res.status(400).json({error: 'Missing field'})
    }

    productid = parseInt(productid)

    if(Number.isNaN(productid)){
        return res.status(400).json({error: 'Invalid request'})
    }

    await db.query(`
        DELETE FROM cart_items 
        WHERE product_id = $1 AND user_id = $2`, [productid, userID])

   return res.json({message: 'Item has been removed'})
}