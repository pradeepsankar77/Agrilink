const express = require('express');
const router = express.Router();
const {
  createOrder,
  getBuyerOrders,
  getFarmerOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.post('/', protect, authorize('buyer'), createOrder);
router.get('/buyer', protect, authorize('buyer'), getBuyerOrders);
router.get('/farmer', protect, authorize('farmer'), getFarmerOrders);
router.put('/:id/status', protect, authorize('farmer'), updateOrderStatus);

module.exports = router;
