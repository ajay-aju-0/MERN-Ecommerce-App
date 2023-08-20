import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { braintreePaymentController, braintreeTokenController, createProductController, 
        deleteProductController, 
        getProductController, 
        getProductPhotoController, 
        getSingleProduct, 
        productCategoryController, 
        productCountController, 
        productFiltersController, 
        productListController, 
        relatedProductController, 
        searchProductController, 
        updateProductController } from '../controllers/productController.js';
import ExpressFormidable from 'express-formidable';

const router = express.Router();

router.post('/create-product',requireSignIn,isAdmin,ExpressFormidable(),createProductController);

router.get('/get-products',getProductController);

router.get('/get-product/:slug',getSingleProduct);

router.get('/product-photo/:id',getProductPhotoController);

router.delete('/delete-product/:id',deleteProductController);

router.put('/update-product/:id',requireSignIn,isAdmin,ExpressFormidable(),updateProductController);

router.post('/product-filters',productFiltersController);

router.get('/product-count',productCountController);

router.get('/product-list/:page',productListController);

router.get('/search/:keyword',searchProductController);

router.get('/related-product/:pid/:cid',relatedProductController);

router.get('/product-category/:slug',productCategoryController);

router.get('/braintree/token',braintreeTokenController);

router.post('/braintree/payment',requireSignIn,braintreePaymentController);

export default router