const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Buyer only)
const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required',
      });
    }

    if (!deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: 'Delivery address is required',
      });
    }

    let processedItems = [];
    let totalAmount = 0;
    let farmerIdsSet = new Set();

    // Process each item and verify availability
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found`,
        });
      }

      const qty = Number(item.quantity);
      if (product.quantity < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product '${product.name}'. Available: ${product.quantity} ${product.unit}`,
        });
      }

      // Deduct stock quantity
      product.quantity -= qty;
      await product.save();

      const itemTotal = product.price * qty;
      totalAmount += itemTotal;

      farmerIdsSet.add(product.farmerId.toString());

      processedItems.push({
        product: product._id,
        productName: product.name,
        unit: product.unit,
        quantity: qty,
        unitPrice: product.price,
        farmerId: product.farmerId,
      });
    }

    const order = await Order.create({
      buyerId: req.user._id,
      items: processedItems,
      totalAmount,
      deliveryAddress,
      farmerIds: Array.from(farmerIdsSet),
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    console.error('[createOrder Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get orders placed by logged in buyer
// @route   GET /api/orders/buyer
// @access  Private (Buyer only)
const getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user._id })
      .populate('items.product', 'name images category location price unit')
      .populate('farmerIds', 'name farmLocation phone email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get incoming orders for logged in farmer's products
// @route   GET /api/orders/farmer
// @access  Private (Farmer only)
const getFarmerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ farmerIds: req.user._id })
      .populate('buyerId', 'name email phone buyerType')
      .populate('items.product', 'name images category unit price')
      .sort({ createdAt: -1 });

    // Filter items inside orders to only show items belonging to this farmer
    const farmerOrders = orders.map((order) => {
      const orderObj = order.toObject();
      orderObj.items = orderObj.items.filter(
        (item) => item.farmerId && item.farmerId.toString() === req.user._id.toString()
      );
      orderObj.farmerTotal = orderObj.items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      );
      return orderObj;
    });

    res.json({
      success: true,
      count: farmerOrders.length,
      orders: farmerOrders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Farmer only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure farmer is part of this order
    const isFarmerInOrder = order.farmerIds.some(
      (id) => id.toString() === req.user._id.toString()
    );
    if (!isFarmerInOrder) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this order status',
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: `Order status updated to '${status}'`,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getBuyerOrders,
  getFarmerOrders,
  updateOrderStatus,
};
