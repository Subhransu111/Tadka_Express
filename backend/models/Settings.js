const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    whatsappWindow: {
    startTime: { type: String, default: "16:00" }, 
    endTime: { type: String, default: "22:00" }
  },

  pricing: {
    basicPerDay: { type: Number, default: 90 },
    deluxePerDay: { type: Number, default: 130 }
  },

  isServiceActive: { type: Boolean, default: true },
  
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Settings', settingsSchema);

