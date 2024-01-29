import mongoose from 'mongoose';
//import PermissionGroup from './PermissionGroup.js';
import Permission from './Permission.js';
import { STATUS, STATUS_ACTIVE } from '../config/constants.js';
 
const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  /*permissiongroups: [
    {
      //type: mongoose.Schema.Types.ObjectId,
      //ref: PermissionGroup, 
      permissions: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: Permission
        }
      ]
    }
  ],*/
  permissions:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Permission
    }
  ],
  status: {
    type: String,
    enum: STATUS,
    default: STATUS_ACTIVE
  },
  deletedAt: { type: Date, default: null },
}, {
  timestamps: true
});

export default mongoose.model('Role', roleSchema);