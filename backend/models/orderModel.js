const mongoose = require('mongoose')

const orderSchema = mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    product: [
        {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      ],
    // order: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: "Cart",
    // },
    orderId: {
        type: String,
        // required: [true, 'Please add order Id'],
    },
    paymentId: {
        type: String,
        // required: [true, 'Please add paymnet Id'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Please add paymnet price'], 
    },
    delivered: {
        type: Boolean,
        // required: [true, 'Please add paymnet Id'], 
        default: false,
    },
    paid: {
        type: Boolean,
        // required: [true, 'Please add paymnet Id'], 
        default: false,
    },
    currenct: {
      type: String,
      default: "INR"
    }
    // price: {
    //     type: Number,
    //     required: [true, 'Please add a number value'],
    // },
    // image: {
    //     type: String,
    //     required: [true, 'Please add a text value'],
    // },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Order', orderSchema)
