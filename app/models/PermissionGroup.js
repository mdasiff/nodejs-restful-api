import mongoose from 'mongoose';
//import Permission from './Permission.js';

/*export const Permission = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  //description: String,
  deletedAt: { type: Date, default: null },
}, {
  timestamps: true
});*/

const schema = new mongoose.Schema({
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
  // permissions: [{ 
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: Permission 
  // }],
  //permissions: [Permission],
  //description: String,
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date }
}, {
  timestamps: true
});

export default mongoose.model('PermissionGroup', schema);