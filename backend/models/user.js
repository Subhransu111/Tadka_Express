const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true, 
        trim : true
    },
    email:{
        type:String,
        required:false, 
        unique:false,
        trim : true,
        lowercase:true,
        sparse:true

    },
    phone:{
        type:String,
        required:true,
        unique:true,
        trim: true,
        match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian phone number']

    },
    passwordHash:{
        type:String,
        required:true
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    address:{
        street: { type: String, trim: true },
        landmark: { type: String, trim: true },
        pincode: { type: String, match: [/^\d{6}$/, 'Pincode must be exactly 6 digits'] }
    },
    referralCode: { type: String, unique: true }, 
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rewardPoints: { type: Number, default: 0 },
    walletBalance: { type: Number, default: 0 },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date }

    

},{ timestamps: true })



module.exports = mongoose.model('User', UserSchema);