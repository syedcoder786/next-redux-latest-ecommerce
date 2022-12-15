const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    product: [
      {
        type: mongoose.Schema.Types.ObjectId,
        //   required: true,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartSchema);
