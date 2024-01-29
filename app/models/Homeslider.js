import mongoose from 'mongoose';
import { STATUS, STATUS_ACTIVE } from '../config/constants.js';

const modelSchema = new mongoose.Schema({
  
  //Add other fields here
  name: {
    type: String,
    required: true,
    unique: true
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

export default mongoose.model('Homeslider', modelSchema);