const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a text value'],
    },
    description: {
        type: String,
        required: [true, 'Please add a text value'],
    },
    price: {
        type: Number,
        required: [true, 'Please add a number value'],
    },
    image: {
        type: String,
        required: [true, 'Please add a text value'],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Product', productSchema)
