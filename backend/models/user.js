const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true, 
        trim : true
    },
    email:{
        type:String,
        required:true, 
        unique:true,
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
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    address:{
        street: { type: String, trim: true },
        landmark: { type: String, trim: true },
        pincode: { type: String, match: [/^\d{6}$/, 'Pincode must be exactly 6 digits'] }
    }
    

},{ timestamps: true })

UserSchema.index({phone: 1});

module.exports = mongoose.model('User', UserSchema);