const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price per unit is required'],
      min: [0, 'Price must be non-negative'],
    },
    unit: {
      type: String,
      required: [true, 'Unit of measurement is required'],
      default: 'kg',
      enum: ['kg', 'ton', 'quintal', 'bag', 'crate', 'litre', 'dozen'],
    },
    quantity: {
      type: Number,
      required: [true, 'Available quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Dairy', 'Organic', 'Spices'],
      default: 'Vegetables',
    },
    images: [
      {
        type: String,
      },
    ],
    location: {
      type: String,
      required: [true, 'Location/Origin is required'],
      trim: true,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
