import fs from 'fs'
import productModel from '../models/productModel.js';
import categoryModel from '../models/categoryModel.js'
import orderModel from '../models/orderModel.js';
import slugify from 'slugify';
import braintree from 'braintree';
import dotenv from "dotenv";

dotenv.config();


// Payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
  });

export const createProductController = async(req,res) => {
    try {
        const {name,slug,description,price,category,quantity,shipping} = req.fields
        const {photo} = req.files
        //validation
        switch(true){
            case !name: return res.status(500).send({error:'Name is required'});
            case !description: return res.status(500).send({error:'Description is required'});
            case !price: return res.status(500).send({error:'Price is required'});
            case !category: return res.status(500).send({error:'Category is required'});
            case !quantity: return res.status(500).send({error:'Quantity is required'});
            case photo && photo.size > 1000000: return res.status(500).send({error:'Photo is required and should be less than 1mb'});
        }

        const products = new productModel({...req.fields,slug:slugify(name)});
        // console.log(products)
        if(photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(200).send({
            success:true,
            message:'product created successfully',
            products
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'error in creating products',
            error
        })
    }
}

export const getProductController = async(req,res) => {
    try {
        const products = await productModel.find({}).populate('category').select('-photo').limit(12).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            message:"all products",
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'error in getting products',
            error
        })
    }
}

export const getSingleProduct = async(req,res) => {
    try {
        const product = await productModel.findOne({slug:req.params.slug}).select('-photo').populate('category')
        res.status(200).send({
            success:true,
            message:"single product fetched",
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'error in getting product',
            error
        })
    }
}

export const getProductPhotoController = async(req,res) => {
    try {
        const product = await productModel.findById(req.params.id).select('photo')
        if(product.photo.data) {
            res.set('content-type',product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error in getting product photo',
            error
        })
    }
}

export const deleteProductController = async(req,res) => {
    try {
        await productModel.findByIdAndDelete(req.params.id).select('-photo')
        res.status(200).send({
            success:true,
            message:'product deleted successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error in deleting product',
            error
        })
    }
}

export const updateProductController = async(req,res) => {
    try {
        const {name,slug,description,price,category,quantity,shipping} = req.fields
        const {photo} = req.files
        //validation
        switch(true){
            case !name: return res.status(500).send({error:'Name is required'});
            case !description: return res.status(500).send({error:'Description is required'});
            case !price: return res.status(500).send({error:'Price is required'});
            case !category: return res.status(500).send({error:'Category is required'});
            case !quantity: return res.status(500).send({error:'Quantity is required'});
            case photo && photo.size > 1000000: return res.status(500).send({error:'Photo is required and should be less than 1mb'});
        }

        const products = await productModel.findByIdAndUpdate(req.params.id,{...req.fields,slug:slugify(name)},{new:true})
        // console.log(products)
        if(photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(200).send({
            success:true,
            message:'product updated successfully',
            products
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'error in updating products',
            error
        })
    }
}

export const productFiltersController = async(req,res) => {
    try {
        const {checked,radio} = req.body;
        let args = {}
        if(checked.length > 0)  args.category = checked 
        if(radio.length) args.price = {$gte:radio[0],$lte:radio[1]}
        const products = await productModel.find(args);
        res.status(200).send({
            success:true,
            products
        }) 
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'error while filtering products',
            error
        })
    }
}

export const productCountController = async(req,res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success:true,
            total
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error in product count',
            error
        })
    }
}

export const productListController = async(req,res) => {
    try {
        const perPage = 2;
        const page = req.params.page ? req.params.page:1;
        const products = await productModel.find({}).select('-photo').skip((page-1) * perPage ).limit(perPage).sort({createdAt:-1});
        res.status(200).send({
            success:true,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:'error in per page ctrl',
            error
        })
    }
}

export const searchProductController = async(req,res) => {
    try {
        const {keyword} = req.params
        const result = await productModel.find({
            $or:[
                {name:{$regex:keyword,$options:"i"}},
                {description:{$regex:keyword,$options:"i"}},
            ]
        }).select("-photo");
        res.json(result);
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:'error in per page ctrl',
            error
        })
    }
}

export const relatedProductController = async(req,res) => {
    try {
        const {pid,cid} = req.params
        // console.log(pid,cid)
        const products = await productModel.find({
            category:cid,
            _id:{$ne:pid}
        }).select('-photo').limit(3).populate('category')
        // console.log(products);
        res.status(200).send({
            success:true,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:'error in getting related product',
            error
        })
    }
}

export const productCategoryController = async(req,res) => {
    try {
        const category = await categoryModel.findOne({slug:req.params.slug});
        const products = await productModel.find({category}).populate('category');
        // console.log(category,products);
        res.status(200).send({
            success:true,
            category,
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:'error while getting product',
            error
        })
    }
}

export const braintreeTokenController = async(req,res) => {
    try {
        gateway.clientToken.generate({},function(err,response){
            if(err){
                res.status(500).send(err);
            } else {
                // console.log(response);
                res.send(response);
            }
        })
    } catch (error) {
        console.log(error);
    }
}

export const braintreePaymentController = async(req,res) => {
    try {
        const {nonce,cart} = req.body;
        let total = 0;
        cart?.map((i) => {
            total += i.price;
        });
        console.log(cart);
        // console.log(nonce);

        let newTransaction = gateway.transaction.sale({
            amount:total,
            paymentMethodNonce:nonce,
            options:{
                submitForSettlement:true
            }
        },
        function(error,result){
            // console.log(result)
            if(result){
                const order = new orderModel({
                    products: cart,
                    payment: result,
                    buyer: req.user._id
                }).save();
                res.json({ok:true});
            }
            else {
                res.status(500).send(error)
            }
        }
        )
    } catch (error) {
        console.log(error);
    }
}