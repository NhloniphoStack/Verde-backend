import express from 'express'
import { login, logout, signup } from '../controllers/authController.js'


export const authRouter = express.Router()

authRouter.post('/login', login)

authRouter.post('/signup', signup)

authRouter.post('/logout', logout)

