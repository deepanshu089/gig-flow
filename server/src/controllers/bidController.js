const Bid = require('../models/Bid');
const Gig = require('../models/Gig');
const mongoose = require('mongoose');

const placeBid = async (req, res) => {
    const { gigId, message, price } = req.body;
    try {
        const gig = await Gig.findById(gigId);
        if (!gig || gig.status !== 'open') {
            return res.status(400).json({ message: 'Gig not found or closed' });
        }

        const existingBid = await Bid.findOne({ gigId, freelancerId: req.user._id });
        if (existingBid) {
            return res.status(400).json({ message: 'You have already bid on this gig' });
        }

        const bid = await Bid.create({
            gigId,
            freelancerId: req.user._id,
            message,
            price
        });
        res.status(201).json(bid);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBidsForGig = async (req, res) => {
    const { gigId } = req.params;
    try {
        const gig = await Gig.findById(gigId);
        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }
        if (gig.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const bids = await Bid.find({ gigId }).populate('freelancerId', 'name email');
        res.json(bids);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const hireFreelancer = async (req, res) => {
    const { bidId } = req.params;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const bid = await Bid.findById(bidId).session(session);
        if (!bid) {
            throw new Error('Bid not found');
        }

        const gig = await Gig.findById(bid.gigId).session(session);
        if (!gig) {
            throw new Error('Gig not found');
        }

        if (gig.ownerId.toString() !== req.user._id.toString()) {
            throw new Error('Not authorized to hire for this gig');
        }

        if (gig.status !== 'open') {
            throw new Error('Gig is already assigned');
        }

        gig.status = 'assigned';
        await gig.save({ session });

        bid.status = 'hired';
        await bid.save({ session });

        await Bid.updateMany(
            { gigId: gig._id, _id: { $ne: bid._id } },
            { $set: { status: 'rejected' } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        const io = req.app.get('io');
        io.to(bid.freelancerId.toString()).emit('notification', {
            message: `You have been hired for ${gig.title}!`
        });

        res.json({ message: 'Freelancer hired successfully' });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: error.message });
    }
}

const getMyBids = async (req, res) => {
    try {
        const bids = await Bid.find({ freelancerId: req.user._id }).populate('gigId');
        res.json(bids);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { placeBid, getBidsForGig, hireFreelancer, getMyBids };
