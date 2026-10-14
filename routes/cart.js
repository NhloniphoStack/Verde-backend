
import express from 'express'
import { addItem, getCartItems, removeCartItem } from '../controllers/cartController.js'
import { requireAuth } from '../middleware/requireAuth.js'

export const cartRouter = express.Router()

cartRouter.post('/cart', requireAuth, addItem)

cartRouter.delete('/cart', requireAuth, removeCartItem)


cartRouter.get('/cart', requireAuth, getCartItems)