import express from 'express';
import { initiateCall } from '../services/twilioService';
import { getUserResponses } from '../models/userResponse';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

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
