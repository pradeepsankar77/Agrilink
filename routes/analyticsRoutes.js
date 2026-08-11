const express = require('express');
const router = express.Router();
const { getFarmerAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.get('/farmer', protect, authorize('farmer'), getFarmerAnalytics);

module.exports = router;
