import connectDB from '../app/database/connect.js';
connectDB();
import Model from '../app/models/Admin.js';

module.export = {
  up: async () => {
    
    await Model.createCollection();
  },
  down: async () => {
    await Model.collection.drop();
  },
};
