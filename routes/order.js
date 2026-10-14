import express from 'express'
import { addOrder, cancelOrder, getOrders, getSingleOrder, } from '../controllers/orderController.js'
export const orderRouter = express.Router()
import { requireAuth } from '../middleware/requireAuth.js'


orderRouter.post('/order', requireAuth,  addOrder)

orderRouter.get('/order', requireAuth,  getOrders)

orderRouter.get('/order/:id', requireAuth, getSingleOrder)
orderRouter.delete('/order', requireAuth, cancelOrder)