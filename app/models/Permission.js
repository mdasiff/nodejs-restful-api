import mongoose from 'mongoose';
import PermissionGroup from './PermissionGroup.js';

const METHOD = [
  'GET', 'POST', 'PUT', 'PATCH', 'DELETE'
];

const permissionSchema = new mongoose.Schema({
  permissiongroup:{type: mongoose.Schema.Types.ObjectId, ref: PermissionGroup},
  name: String,
  slug: String,
  method: {
    type: String,
    required: true,
    enum: METHOD
  },
  deletedAt: { type: Date, default: null },
}, {
  timestamps: true
});

export default mongoose.model('Permission', permissionSchema);