import express from 'express'
import { adminAuth } from '../middleware/adminAuth.js'
import { getAllOrders, updateOrder, getALLProducts, addNewProduct, editProduct, deleteProduct, uploadImage, getSingleProduct } from '../controllers/adminController.js'
export const adminRouter = express.Router()
import { upload } from '../middleware/multer.js'


adminRouter.get('/admin/orders', adminAuth, getAllOrders)

adminRouter.post('/admin/orders/:id', adminAuth, updateOrder)

adminRouter.get('/admin/products', adminAuth, getALLProducts)

adminRouter.post('/admin/products', adminAuth, upload.single('image'), addNewProduct)

adminRouter.get('/admin/products/:id', adminAuth, getSingleProduct)

adminRouter.patch('/admin/products/:id', adminAuth, editProduct)

adminRouter.delete('/admin/products/:id', adminAuth, deleteProduct)



adminRouter.post('/admin/upload', adminAuth, upload.single('image'), uploadImage)

