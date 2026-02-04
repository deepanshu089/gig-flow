const Gig = require('../models/Gig');

const getGigs = async (req, res, next) => {
    const { search } = req.query;
    try {
        let query = { status: 'open' };
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        const gigs = await Gig.find(query).populate('ownerId', 'name email').sort({ createdAt: -1 });
        res.json({ success: true, data: gigs });
    } catch (error) {
        next(error);
    }
};

const createGig = async (req, res, next) => {
    const { title, description, budget } = req.body;
    try {
        const gig = await Gig.create({
            title,
            description,
            budget,
            ownerId: req.user._id,
        });
        res.status(201).json({ success: true, message: 'Gig created successfully', data: gig });
    } catch (error) {
        next(error);
    }
};

const getMyGigs = async (req, res, next) => {
    try {
        const gigs = await Gig.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, data: gigs });
    } catch (error) {
        next(error);
    }
}

const getGigById = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');
        if (!gig) {
            return res.status(404).json({
                success: false,
                message: 'Gig not found',
                errorCode: 'NOT_FOUND'
            });
        }
        res.json({ success: true, data: gig });
    } catch (error) {
        next(error);
    }
}

const updateGig = async (req, res, next) => {
    try {
        const { title, description, budget, status } = req.body;

        // Check if gig exists and user has permission
        const gig = await Gig.findById(req.params.id);

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: 'Gig not found',
                errorCode: 'NOT_FOUND'
            });
        }

        // Check ownership (users can only update their own gigs, admins can update any)
        if (req.user.role !== 'admin' && gig.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only update your own gigs',
                errorCode: 'FORBIDDEN'
            });
        }

        // Update fields
        if (title) gig.title = title;
        if (description) gig.description = description;
        if (budget) gig.budget = budget;
        if (status) gig.status = status;

        await gig.save();

        res.json({
            success: true,
            message: 'Gig updated successfully',
            data: gig
        });
    } catch (error) {
        next(error);
    }
};

const deleteGig = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.id);

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: 'Gig not found',
                errorCode: 'NOT_FOUND'
            });
        }

        // Check ownership (users can only delete their own gigs, admins can delete any)
        if (req.user.role !== 'admin' && gig.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own gigs',
                errorCode: 'FORBIDDEN'
            });
        }

        await Gig.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Gig deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getGigs, createGig, getMyGigs, getGigById, updateGig, deleteGig };
