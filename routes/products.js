import express from 'express'
import { getProducts, getProduct } from '../controllers/productsController.js'


export const productsRouter = express.Router()

productsRouter.get('/products', getProducts)

productsRouter.get('/products/:id', getProduct)