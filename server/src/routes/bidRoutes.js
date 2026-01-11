const express = require('express');
const router = express.Router();
const { placeBid, getBidsForGig, hireFreelancer, getMyBids } = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, placeBid);
router.get('/my', protect, getMyBids);
router.get('/:gigId', protect, getBidsForGig);
router.patch('/:bidId/hire', protect, hireFreelancer);

module.exports = router;
