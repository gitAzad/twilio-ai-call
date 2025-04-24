import express from 'express';
import { initiateCall } from '../services/twilioService';
import { getUserResponses } from '../models/userResponse';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

/**
 * @swagger
 * /setup/start-call:
 *   post:
 *     summary: Start a setup call
 *     description: Initiates a Twilio call to collect setup information from a user
 *     tags:
 *       - Setup
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number to call (E.164 format)
 *                 example: "+1234567890"
 *     responses:
 *       200:
 *         description: Call initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Setup call initiated"
 *                 userId:
 *                   type: string
 *                   example: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d"
 *                 callSid:
 *                   type: string
 *                   example: "CA1234567890abcdef1234567890abcde"
 *       400:
 *         description: Bad request - missing phone number
 *       500:
 *         description: Server error
 */
// Route to start a setup call
router.post('/start-call', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Generate a unique ID for this user
    const userId = uuidv4();

    // Initiate the call
    const callSid = await initiateCall(phoneNumber, userId);

    res.json({
      success: true,
      message: 'Setup call initiated',
      userId,
      callSid,
    });
  } catch (error) {
    console.error('Error starting setup call:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate setup call',
      error: (error as Error).message,
    });
  }
});

/**
 * @swagger
 * /setup/responses/{userId}:
 *   get:
 *     summary: Get user responses
 *     description: Retrieves all responses collected from a specific user
 *     tags:
 *       - Setup
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique identifier of the user
 *     responses:
 *       200:
 *         description: User responses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d"
 *                 responses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserResponse'
 */
// Route to get all responses for a user
router.get('/responses/:userId', (req, res) => {
  const { userId } = req.params;
  const responses = getUserResponses(userId);

  res.json({
    userId,
    responses,
  });
});

export default router;
