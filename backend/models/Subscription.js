const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    planType:{
        type: String,
        enum: ['basic', 'deluxe'],
        required: true
    },
    startDate:{
        type: Date,
        default: Date.now,
        required: true
    },
    endDate:{
        type: Date,
    },
    totalDays:{
        type: Number,
        required: true,
        min:[15, 'Total days must be at least 15'],
        default:15
    },
    pricePerDay:{
        type: Number,
        required: true
    },
    totalPrice:{
        type: Number,
        required: true  
    },
    usedDays:{
        type: Number,
        default: 0
    },
    status:{
        type: String,
        enum: ['active', 'expired', 'pending_payment','cancelled'],
        default: 'pending_payment'
    },
razorpayOrderId: { type: String }
}, { timestamps: true });

subscriptionSchema.pre('save', function(next) {
  if (this.startDate && this.totalDays) {
    const start = new Date(this.startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + this.totalDays);
    this.endDate = end;
  }
  next();
});

module.exports = mongoose.model('Subscription', subscriptionSchema);