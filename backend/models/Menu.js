const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    planType: {
        type: String,
        enum:['basic', 'deluxe', 'royal'],
        required: true
    },
    optionNumber: { 
    type: Number, 
    default: 1 
  },

  itemName: { 
    type: String, 
    required: true,
    trim: true 
  },

  components: [{ 
    type: String, 
    trim: true 
  }],

  price: { 
    type: Number, 
    required: function() { return this.planType === 'royal'; } 
  },

  isAvailable: { 
    type: Boolean, 
    default: true 
  },

  availableDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }]
}, { 
  timestamps: true 
});

menuSchema.index({ planType: 1, isAvailable: 1 });

module.exports = mongoose.model('Menu', menuSchema);

