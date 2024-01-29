import mongoose from 'mongoose';

const modelSchema = new mongoose.Schema({
  
  //Add other fields here
  meta_key: {
    type: String,
    required: true,
    unique: true
  },
  meta_value: {
    type: String,
    required: true
  },
  deletedAt: { type: Date, default: null },
}, {
  timestamps: true
});

export default mongoose.model('Sitesetting', modelSchema);