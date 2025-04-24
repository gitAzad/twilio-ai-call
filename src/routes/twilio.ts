import express from 'express';
import { generateTwiMLForQuestion } from '../services/twilioService';
import { saveResponse } from '../models/userResponse';

const router = express.Router();

/**
 * @swagger
 * /twilio/voice:
 *   post:
 *     summary: Handle Twilio voice webhook
 *     description: Generates TwiML to ask questions for the setup flow
 *     tags:
 *       - Twilio
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique identifier for the user
 *       - in: query
 *         name: questionIndex
 *         schema:
 *           type: string
 *         required: false
 *         description: Index of the question to ask (defaults to 0)
 *     responses:
 *       200:
 *         description: TwiML response
 *         content:
 *           text/xml:
 *             schema:
 *               type: string
 *               example: "<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response>...</Response>"
 */
// Handle incoming voice calls
router.post('/voice', (req, res) => {
  const userId = req.query.userId as string;
  const questionIndex = parseInt((req.query.questionIndex as string) || '0');

  const twimlResponse = generateTwiMLForQuestion(questionIndex, userId);

  res.type('text/xml');
  res.send(twimlResponse);
});

/**
 * @swagger
 * /twilio/response:
 *   post:
 *     summary: Handle speech response webhook
 *     description: Saves the user's speech response and moves to the next question
 *     tags:
 *       - Twilio
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique identifier for the user
 *       - in: query
 *         name: questionIndex
 *         schema:
 *           type: string
 *         required: true
 *         description: Index of the question being answered
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               SpeechResult:
 *                 type: string
 *                 description: The speech recognition result
 *               From:
 *                 type: string
 *                 description: The phone number of the caller
 *     responses:
 *       200:
 *         description: TwiML response for the next question
 *         content:
 *           text/xml:
 *             schema:
 *               type: string
 */
// Handle speech responses
router.post('/response', (req, res) => {
  const userId = req.query.userId as string;
  const questionIndex = parseInt(req.query.questionIndex as string);
  const speechResult = req.body.SpeechResult;

  // Save the response
  saveResponse({
    userId,
    phoneNumber: req.body.From,
    questionId: questionIndex.toString(),
    response: speechResult,
    timestamp: new Date(),
  });

  // Move to the next question
  const nextQuestionIndex = questionIndex + 1;
  const twimlResponse = generateTwiMLForQuestion(nextQuestionIndex, userId);

  res.type('text/xml');
  res.send(twimlResponse);
});

export default router;
