import express from 'express'
import { requireSignIn,isAdmin } from './../middlewares/authMiddleware.js'
import { createCategoryController,updateCategoryController,getCategoryController,getSingleCategoryController,deleteCategoryController } from '../controllers/categoryController.js'

const router = express.Router();

router.post('/create-category',requireSignIn,isAdmin,createCategoryController);

router.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController);

router.get('/all-categories',getCategoryController);

router.get('/single-category/:slug',getSingleCategoryController);

router.delete('/delete-category/:id',requireSignIn,isAdmin,deleteCategoryController);

export default router;