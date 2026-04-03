const mongoose = require('mongoose');

const dailyOrderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'User',
        required:true
    },
    date: { type: Date, required: true },
  
  orderType: { 
    type: String, 
    enum: ['subscription', 'on-demand'], 
    required: true 
  },
  
  planType: { 
    type: String, 
    enum: ['basic', 'deluxe', 'royal'], 
    required: true 
  },

  // For Royal: User selects 1 of 7 sets. For Deluxe: User selects protein.
  selectedItem: { type: String, required: false, default: 'chef_choice' }, 
  
  isSkipped: { type: Boolean, default: false },
  
  paymentStatus: { 
    type: String, 
    enum: ['paid', 'pending'], 
    default: 'pending' 
  },

  deliveryStatus: { 
    type: String, 
    enum: ['pending', 'preparing', 'out_for_delivery', 'delivered', 'skipped'], 
    default: 'pending' 
  }
}, { timestamps: true });


dailyOrderSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyOrder', dailyOrderSchema);