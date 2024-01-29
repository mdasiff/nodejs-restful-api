import mongoose from 'mongoose';

const dpSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  time: {
    type: String,
    required: true,
  },
  cost_range: [{ type: Number }],
  sortBy: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('DeliveryPreference', dpSchema);