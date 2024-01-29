import mongoose from 'mongoose';
import { STATUS, STATUS_ACTIVE } from '../config/constants.js';
import Role from './Role.js';
import DeliveryPreference from './DeliveryPreference.js';
import Address from './Address.js';


const delivery_preferencesSchema = new mongoose.Schema({
  delivery_preference: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: DeliveryPreference 
  },
  name:{
    type: String,
    required: true
  },
  cost: Number,
  status: {
    type: String,
    enum: STATUS,
    default: STATUS_ACTIVE
  }
},
{
  timestamps: true
});

const store_addressesSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pincode: {
    type: Number,
    required: true
  },
  landmark: String,
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date }
});

const service_areasSchema = new mongoose.Schema({
  address: { type: mongoose.Schema.Types.ObjectId, ref: Address },
  status: {
    type: String,
    enum: STATUS,
    default: STATUS_ACTIVE
  },
  delivery_preferences:[delivery_preferencesSchema],
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date }
},
{
  timestamps: true
});

const vendorSchema = new mongoose.Schema({
  store_addresses: [store_addressesSchema],
  service_areas: [service_areasSchema],
  //delivery_preferences: [delivery_preferencesSchema]
});

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
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
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: Role }],
  roles_name: [{ type: String }],
  vendor : vendorSchema,
  deletedAt: { type: Date, default: null },
}, {
  timestamps: true
});

export default mongoose.model('Admin', adminSchema);