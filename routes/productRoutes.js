const express = require('express');
const router = express.Router();
const {
  getProducts,
  getFarmerProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getProducts);

// Private Farmer routes
router.get('/farmer', protect, authorize('farmer'), getFarmerProducts);
router.get('/:id', getProductById);

router.post('/', protect, authorize('farmer'), upload.single('image'), createProduct);
router.put('/:id', protect, authorize('farmer'), upload.single('image'), updateProduct);
router.delete('/:id', protect, authorize('farmer'), deleteProduct);

module.exports = router;
