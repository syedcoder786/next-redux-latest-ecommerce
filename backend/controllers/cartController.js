const asyncHandler = require("express-async-handler");

const Cart = require("../models/cartModel");

const addToCart = asyncHandler(async (req, res) => {
  const cart = await Cart.find({ user: req.user.id });

  // console.log(req.body.product_id);

  if (cart.length > 0) {
    let find = cart[0].product.find((x) => x == req.body.product_id);

    // console.log("Find");
    // console.log(find);

    if (find) {
      // throw new Error("Already Added To Cart");
      return res.status(500).json({ message: "Already Added To Cart" });
    }
    try {
      await Cart.updateOne(
        { user: req.user.id },
        { $addToSet: { product: req.body.product_id } }
      );

      const newCart = await Cart.find({ user: req.user.id }).populate(
        "product"
      );

      res.status(200).json(newCart[0]);
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  try {
    let newCart = await Cart.create({
      user: req.user.id,
      product: req.body.product_id,
    });

    newCart = await newCart.populate("product");
    console.log(newCart);
    res.status(200).json(newCart);
  } catch (e) {
    console.log(e);
  }
});

const fetchCart = asyncHandler(async (req, res) => {
  const cartItems = await Cart.find({ user: req.user.id }).populate("product");

  console.log(cartItems[0]);
  res.status(200).json(cartItems[0]);
});

const removeFromCart = asyncHandler(async (req, res) => {
  try {
    console.log("idddd");
    console.log(req.params.id);
    await Cart.updateOne(
      { user: req.user.id },
      { $pull: { product: req.params.id } }
    );

    const newCart = await Cart.find({ user: req.user.id }).populate("product");

    console.log(newCart[0]);
    res.status(200).json(newCart[0]);
  } catch (error) {
    console.log(error);
    return;
  }
});

module.exports = {
  addToCart,
  fetchCart,
  removeFromCart,
};
