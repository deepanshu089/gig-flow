const express = require('express');
const router = express.Router();
const { getGigs, createGig, getMyGigs, getGigById, updateGig, deleteGig } = require('../../controllers/gigController');
const { protect } = require('../../middleware/authMiddleware');
const { validate, gigSchema, gigUpdateSchema } = require('../../middleware/validation');

/**
 * @swagger
 * /api/v1/gigs/my:
 *   get:
 *     summary: Get current user's gigs
 *     tags: [Gigs]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user's gigs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Gig'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/my', protect, getMyGigs);

/**
 * @swagger
 * /api/v1/gigs:
 *   get:
 *     summary: Get all open gigs
 *     tags: [Gigs]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search gigs by title
 *     responses:
 *       200:
 *         description: List of open gigs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Gig'
 *   post:
 *     summary: Create a new gig
 *     tags: [Gigs]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - budget
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 minLength: 20
 *                 maxLength: 1000
 *               budget:
 *                 type: number
 *                 minimum: 1
 *     responses:
 *       201:
 *         description: Gig created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Gig'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/')
    .get(getGigs)
    .post(protect, validate(gigSchema), createGig);

/**
 * @swagger
 * /api/v1/gigs/{id}:
 *   get:
 *     summary: Get a gig by ID
 *     tags: [Gigs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Gig ID
 *     responses:
 *       200:
 *         description: Gig details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Gig'
 *       404:
 *         description: Gig not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Update a gig (owner or admin only)
 *     tags: [Gigs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Gig ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 minLength: 20
 *                 maxLength: 1000
 *               budget:
 *                 type: number
 *                 minimum: 1
 *               status:
 *                 type: string
 *                 enum: [open, assigned]
 *     responses:
 *       200:
 *         description: Gig updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Gig'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Not authorized (not owner or admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Gig not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete a gig (owner or admin only)
 *     tags: [Gigs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Gig ID
 *     responses:
 *       200:
 *         description: Gig deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Not authorized (not owner or admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Gig not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/:id')
    .get(getGigById)
    .put(protect, validate(gigUpdateSchema), updateGig)
    .delete(protect, deleteGig);

module.exports = router;
