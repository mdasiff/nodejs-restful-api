import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  CircleName: {
    type: String,
    required: true,
  },
  RegionName: {
    type: String,
    required: true,
  },
  DivisionName: {
    type: String,
    required: true
  },
  OfficeName: {
    type: String,
    required: true
  },
  Pincode: {
    type: Number,
    required: true
  },
  OfficeType: {
    type: String,
    required: true
  },
  District: {
    type: String,
    required: true
  },
  StateName: {
    type: String,
    required: true
  },
  Latitude: {
    type: Number,
    required: true
  },
  Longitude: {
    type: Number,
    required: true
  },
}, {
  timestamps: true
});

export default mongoose.model('Address', userSchema);