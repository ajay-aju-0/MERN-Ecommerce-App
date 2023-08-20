import slugify from 'slugify';
import categoryModel from '../models/categoryModel.js'

export const createCategoryController = async(req,res) => {
    try {
        const {name} = req.body
        if(!name) {
            return res.status(401).send({message:'name is required'})
        }
        const existingCategory = await categoryModel.findOne({name});
        if(existingCategory) {
            return res.status(200).send({
                success:true,
                message:'Category already exists'
            })
        }
        const category = await new categoryModel({name,slug:slugify(name)}).save()
        res.status(201).send({
            success:true,
            message:'new category created',
            category
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'error in category',
            error
        })
    }
};

export const updateCategoryController = async(req,res) => {
    try {
        const {name} = req.body
        const {id} = req.params
        const category = await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});
        res.status(200).send({
            success:true,
            message:'category updated successfully'
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'error while updating',
            error
        })
    }
}

export const getCategoryController = async(req,res) => {
    try {
        const categories = await categoryModel.find({});
        // console.log(categories)
        res.status(200).send({
            success:true,
            message:'All categories list',
            categories
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'error while getting all category',
            error
        })
    }
}

export const getSingleCategoryController = async(req,res) => {
    try {
        const category = await categoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            message:'category fetching successful',
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'error in getting category',
            error
        })
    }
}

export const deleteCategoryController = async(req,res) => {
    try {
        const {id} = req.params
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:'category deleted successfully',
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'error in deleting category',
            error
        })
    }
}