import express from 'express'
import dotenv from 'dotenv'
import { authRouter } from './routes/auth.js'
import session from 'express-session'
import { featuredRouter } from './routes/featured.js'
import { productsRouter } from './routes/products.js'
import { cartRouter } from './routes/cart.js'
import { meRouter } from './routes/me.js'
import { orderRouter } from './routes/order.js'
import cors from 'cors'
import { adminRouter } from './routes/admin.js'
dotenv.config()



const Port = process.env.PORT 
const app = express()

const allowedOrigins = ["https://verde-ecom.netlify.app/", "http://localhost:5173"]

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))

app.use(express.json())

app.use(session({
    secret: process.env.SUPER_SECRET_KEY,
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    }
    
}))

app.use('/api', adminRouter)

app.use('/api', orderRouter)

app.use('/api', meRouter)

app.use('/api', cartRouter)

app.use('/api', productsRouter)

app.use('/api', featuredRouter)

app.use('/api/auth', authRouter)

app.use((req, res) => {
    return res.status(404).json ({error: "Invalid path"})
})



app.listen(Port, () => console.log(`Server connected at Port: ${Port}`))