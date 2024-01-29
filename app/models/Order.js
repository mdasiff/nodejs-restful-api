import mongoose from 'mongoose';
import { 
  ORDER_STATUS,
  ORDER_STATUS_DEFAULT,
  ORDER_SOURCE,
  ORDER_SOURCE_DEFAULT,
  PAYMENT_STATUS,
  PAYMENT_STATUS_DEFAULT,
  PAYMENT_METHOD,
  PAYMENT_METHOD_DEFAULT,
} from '../config/constants.js';

import Product from './Product.js';
import User from './User.js';
import Coupon from './Coupon.js';

// Schema for individual product items within an order
const products_addressSchama = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: Product },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    flavour: {
      type: String
    },
    weight: {
      type: String
    },
    personalize_photo: {
      type: String
    }
});

// Schema for billing address information
const billing_addressSchama = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String
  },
  phone: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  address1: {
    type: String,
    required: true,
  },
  address2: {
    type: String
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  }
});

// Schema for shipping address information
const shipping_addressSchama = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String
  },
  phone: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  address1: {
    type: String,
    required: true,
  },
  address2: {
    type: String
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  }
});

// Schema for user address information
const user_addressSchama = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: User },
  first_name:{
    type: String,
    required: true,
  },
  last_name:{
    type: String,
    required: true,
  },
  phone:{
    type: String,
    required: true,
  },
  email:{
    type: String
  },
});

// Schema for coupon information
const couponSchema = new mongoose.Schema({
  coupon: { type: mongoose.Schema.Types.ObjectId, ref: Coupon },
  name: {
    type:String,
    required:true
  },
  discount_type: {
    type:String,
    required:true
  },
  discount_value: {
    type:Number,
    required:true
  }
});

// Main order schema
const orderSchema = new mongoose.Schema({
  order_number: {
    type: String,
    required: true,
    unique: true
  },
  source_user_id: {
    type:String
  },
  source: {
    type: String,
    enum: ORDER_SOURCE_DEFAULT,
    default: ORDER_SOURCE
  },
  status: {
    type: String,
    enum: ORDER_STATUS,
    default: ORDER_STATUS_DEFAULT
  },
  payment_status: {
    type: String,
    enum: PAYMENT_STATUS,
    default: PAYMENT_STATUS_DEFAULT
  },
  payment_method: {
    type: String,
    enum: PAYMENT_METHOD,
    default: PAYMENT_METHOD_DEFAULT
  },
  order_date: {
    type: String,
    required: true,
  },
  delivery_date: {
    type: String
  },
  delivery_time: {
    type: String
  },
  shipping_method: {
    type: String
  },
  shipping_cost: {
    type: Number
  },
  user_note: {
    type:String
  },
  coupon: couponSchema,
  tax: {
    type: Number
  },
  subtotal: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  products:[products_addressSchama],
  billing_address:billing_addressSchama,
  shipping_address:shipping_addressSchama,
  user:user_addressSchama,
}, {
  timestamps: true
});

export default mongoose.model('Order', orderSchema);