import mongoose from 'mongoose';
import { STATUS, STATUS_ACTIVE } from '../config/constants.js';

const schema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true
  },
  discounted_price: {
    type: Number,
    required: true
  },
  image: {
    type: String
  },
  short_description: String,
  long_description: String,
  status: {
    type: String,
    enum: STATUS,
    default: STATUS_ACTIVE
  },
  deletedAt: { type: Date, default: null },
}, {
  timestamps: true
});

export default mongoose.model('Product', schema);