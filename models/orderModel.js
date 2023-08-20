import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    products:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'product'
        }
    ],
    payment:{},
    buyer:{
        type: mongoose.Schema.ObjectId,
        ref:'users'
    },
    status:{
        type: String,
        default: 'Not Processed',
        enum:['Not Processed','Processing','Shipped','Deliver','Cancel']
    }
},{timestamps:true});

export default mongoose.model('order',orderSchema);