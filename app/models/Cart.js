import mongoose from 'mongoose';
import User from './User.js';
import Product from './Product.js';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Product,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const modelSchema = new mongoose.Schema({
  
  //Add other fields here
  unique_id: {
    type: String,
    required: true
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: User },
  products:[cartItemSchema],
}, {
  timestamps: true
});

export default mongoose.model('Cart', modelSchema);