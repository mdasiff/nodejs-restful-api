import Model from '../models/Cart.js';

const addItemToCart = async (req) => {
  const { unique_id, user, product, product_detail } = req.body;

  // Check if the product with the specified _id is already in the cart
  const existingCartItem = await Model.findOne({
    unique_id,
    'products.product': product_detail._id,
  });

  if (existingCartItem) {
    // If the product is already in the cart, update the quantity
    await Model.updateOne(
      {
        unique_id,
        'products.product': product_detail._id,
      },
      {
        $set: { 'products.$.quantity': product.quantity },
      }
    );

    // Fetch and return the updated cart
    const updatedCart = await Model.findOne({ unique_id });
    return updatedCart;
  }

  // If the product is not in the cart, create a new cart item
  const cart_data = {
    unique_id,
    user,
      products: {
        product: product_detail._id,
        quantity: product.quantity,
      }
  };

  // Create a new instance of the Model with data from the request body
  const data = new Model(cart_data);

  // Save the data to the database asynchronously
  await data.save();
  return data;
};


export { 
  addItemToCart
}