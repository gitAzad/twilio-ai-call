import express from 'express';
import { generateTwiMLForQuestion } from '../services/twilioService';
import { saveResponse } from '../models/userResponse';

const router = express.Router();

// Handle incoming voice calls
router.post('/voice', (req, res) => {
  const userId = req.query.userId as string;
  const questionIndex = parseInt((req.query.questionIndex as string) || '0');

  const twimlResponse = generateTwiMLForQuestion(questionIndex, userId);

  res.type('text/xml');
  res.send(twimlResponse);
});

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
