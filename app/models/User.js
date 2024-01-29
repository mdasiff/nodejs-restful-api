import mongoose from 'mongoose';
import { STATUS, STATUS_ACTIVE } from '../config/constants.js';

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  email_verified_at: {
    type: Date
  },
  password:{
    type: String,
    min:8
  },
  phone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: STATUS,
    default: STATUS_ACTIVE
  },
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);