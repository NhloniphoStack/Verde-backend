import express from 'express'
import { getFeatured } from '../controllers/featuredController.js'
export const featuredRouter = express.Router()

featuredRouter.get('/featured', getFeatured)

