const mongoose = require('mongoose')

const CouponSchema = new mongoose.Schema({
    code:{
        type:String,
        required:true,
        unique:true,
        uppercase:true,
 
    },
    discountType: {
        type: String,
        enum: ['percentage', 'flat'],
        required: true
    },
    discountValue: { type: Number, required: true },
    minOrderValue: { type: Number, default: 0 },
    maxDiscount: { type: Number }, 
    expiryDate: { type: Date },
    usageLimit: { type: Number, default: 100 }, 
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });