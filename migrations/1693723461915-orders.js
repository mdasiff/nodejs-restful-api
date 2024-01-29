import connectDB from '../app/database/connect.js';
connectDB();
import Model from '../app/models/Order.js';

module.export = {
  up: async () => {
    
    await Model.createCollection();
  },
  down: async () => {
    await Model.collection.drop();
  },
};
