import mongoose from 'mongoose';
import { STATUS, STATUS_ACTIVE } from '../config/constants.js';

const Schema = new mongoose.Schema({
  field_one: {
    type: String,
    required: true,
  },
  field_two: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

export default mongoose.model('Tax', Schema);