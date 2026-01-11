const Gig = require('../models/Gig');

const getGigs = async (req, res) => {
    const { search } = req.query;
    try {
        let query = { status: 'open' };
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        const gigs = await Gig.find(query).populate('ownerId', 'name email').sort({ createdAt: -1 });
        res.json(gigs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createGig = async (req, res) => {
    const { title, description, budget } = req.body;
    try {
        const gig = await Gig.create({
            title,
            description,
            budget,
            ownerId: req.user._id,
        });
        res.status(201).json(gig);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyGigs = async (req, res) => {
    try {
        const gigs = await Gig.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
        res.json(gigs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getGigById = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');
        if (!gig) return res.status(404).json({ message: 'Gig not found' });
        res.json(gig);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getGigs, createGig, getMyGigs, getGigById };
