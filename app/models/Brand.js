import mongoose from 'mongoose';
import { STATUS, STATUS_ACTIVE } from '../config/constants.js';

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  status: {
    type: String,
    enum: STATUS,
    default: STATUS_ACTIVE
  },
  deletedAt: { type: Date, default: null },
}, {
  timestamps: true
});

export default mongoose.model('Brand', brandSchema);