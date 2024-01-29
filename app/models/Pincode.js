import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  officeName: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
    unique: true,
  },
  taluk: {
    type: String,
    required: true
  },
  districtName: {
    type: String,
    required: true
  },
  stateName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Pincode', userSchema);