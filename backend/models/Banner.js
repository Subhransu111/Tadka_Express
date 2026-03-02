const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Holi Special 20% Off"
  imageUrl: { type: String, required: true }, // URL
  linkTo: { type: String }, // e.g., "/plans" 
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 } // To control which shows first
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);