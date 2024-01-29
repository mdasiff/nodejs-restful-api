import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  ISO: {
    type: String,
    required: true,
  },
  Country: {
    type: String,
    required: true,
  },
  Region: {
    type: String,
    required: true
  },
  Locality: {
    type: String,
    required: true
  },
  Postcode: {
    type: Number,
    required: true
  },
  Street: {
    type: String,
    required: true
  },
  Latitude: {
    type: String,
    required: true
  },
  Longitude: {
    type: String,
    required: true
  },
}, {
  timestamps: true
});

export default mongoose.model('Apple', schema);