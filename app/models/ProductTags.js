import mongoose from 'mongoose';

const dpSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Number,
  },
  modifiedAt: {
    type: Date,
    default: Date.now
  },
  modifiedBy: {
    type: Number,
  }  
}, {
  timestamps: true
});

export default mongoose.model('ProductTags', dpSchema);