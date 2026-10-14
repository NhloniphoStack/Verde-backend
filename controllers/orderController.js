import { db } from "../db/db.js";

export async function addOrder(req, res){

    const userID = req.session.userID;
    
    



    
       const totalDb = await db.query(`
        SELECT SUM(products.price * cart_items.quantity) OVER() AS subTotal
        FROM products
        INNER JOIN
        cart_items ON cart_items.product_id = products.id
        WHERE cart_items.user_id = $1`, [userID])

      const totalValue = Number(totalDb?.rows[0]?.subtotal) + 30


    const stock = await db.query(`
            SELECT cart_items.id,
             cart_items.quantity, 
             products.stock  
             FROM cart_items
             INNER JOIN 
             products ON products.id = cart_items.product_id
             WHERE cart_items.user_id = $1 
             AND cart_items.quantity > products.stock
             `, [userID])

    if(stock.rows.length > 0){
        return res.status(400).json({error: 'Not enough stock'})
    }

    try{

        await db.query('BEGIN');

     const results = await db.query(`
            INSERT INTO orders (total, user_id) 
            VALUES ($1, $2) 
            
            RETURNING id AS order_id
            `, [totalValue, userID])
     


        await db.query(`
          INSERT INTO order_items (order_id, product_id, user_id, quantity)
          SELECT $1, product_id, user_id, quantity
          FROM cart_items
         WHERE user_id = $2
         ON CONFLICT (user_id, product_id)
         DO UPDATE
         SET quantity = order_items.quantity + EXCLUDED.quantity
            `, [results?.rows[0]?.order_id, userID])

       await db.query('COMMIT')


       await db.query(`
        DELETE FROM cart_items 
        WHERE user_id = $1
        `, [userID])

     
       
       return res.json({message: 'Order created', order: {
        id: results?.rows[0]?.order_id,
        status: 'PENDING',
        total: totalValue 
       }})

       

    }catch(error){
        await db.query('ROLLBACK')
        console.log(error)
    }

    return res.status(500).json({error: 'Internal server error'})

}


export async function cancelOrder(req, res){
    const userID = req.session.userID;
    let { orderno } = req.body || {}

    if(!orderno){
        return res.status(400).jsom({error: 'Invalid order request'}) 
    }

    orderno = parseInt(orderno)

    if(Number.isNaN(orderno)){
          return res.status(400).json({error: 'Invalid order request'}) 
    }

    const existing = await db.query(`
            SELECT * FROM orders
             WHERE id = $1`, [orderno])

        if(!existing?.rows.length === 0){
            return res.status(400).json({error: 'No such order exist'}) 
        }

    try{
       
        

        await db.query(`
            DELETE FROM orders 
            WHERE id = $1 AND user_id = $2
            `, [orderno, userID])

        console.log("order deleted")

        await db.query(`
            DELETE FROM order_items 
            WHERE user_id = $1 AND 
            id = $2
            `, [userID, orderno])

        await db.query('COMMIT')

         console.log("order items nuked")

        return res.json({message: 'order cancelled'})

    }catch(error){
        await db.query('ROLLBACK')
        throw error
    }
}

export async function getOrders(req, res){
     let {id} = req.query
     const userID = req.session.userID;

     let query = `SELECT * FROM orders 
        WHERE user_id = $1`
        let params = [userID]

        if(id){
            query +=  ` AND id = $2`
            params.push(id)
        }

    const orders = await db.query(query, params)

    return res.json(orders?.rows)
}

export async function getSingleOrder(req, res){

     const userID = req.session.userID;
    
    let { id } = req.params

    console.log(id)

    if(!id){
        return res.status(401).json({error: 'Invalid request'})
    }

    if(Number.isNaN(id)){
        return res.status(401).json({error: 'Invalid request'})
    }

   const order = await db.query(`
    SELECT * FROM orders
     WHERE user_id = $1 
     AND id = $2
     `, [userID, id])

   return res.json(order.rows[0])
}