import mongoose from 'mongoose';
import { STATUS, STATUS_ACTIVE } from '../config/constants.js';

const schema = new mongoose.Schema({
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  name: {
    type: String,
    required: true
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

export default mongoose.model('Category', schema);