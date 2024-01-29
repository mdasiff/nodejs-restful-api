import mongoose from 'mongoose';
import { 
  STATUS,
  STATUS_ACTIVE,
  DISCOUNT_TYPE,
  DISCOUNT_TYPE_DEFAULT
} from '../config/constants.js';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  discount_type: {
    type: String,
    enum: DISCOUNT_TYPE,
    default: DISCOUNT_TYPE_DEFAULT
  },
  coupon_discount: {
    type: Number
  },
  status: {
    type: String,
    enum: STATUS,
    default: STATUS_ACTIVE
  }
}, {
  timestamps: true
});

export default mongoose.model('Coupon', schema);