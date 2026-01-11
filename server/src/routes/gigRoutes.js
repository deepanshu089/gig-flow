const express = require('express');
const router = express.Router();
const { getGigs, createGig, getMyGigs, getGigById } = require('../controllers/gigController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my', protect, getMyGigs);
router.route('/').get(getGigs).post(protect, createGig);
router.get('/:id', getGigById);

module.exports = router;
