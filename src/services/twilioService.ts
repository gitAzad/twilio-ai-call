import { Twilio } from 'twilio';
import { twilioConfig } from '../config/twilioConfig';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';

const client = new Twilio(twilioConfig.accountSid, twilioConfig.authToken);

// Setup questions
const setupQuestions = [
  'What is your name?',
  'What is your preferred programming language?',
  'How many years of experience do you have?',
  'What is your primary area of expertise?',
];

export const initiateCall = async (
  phoneNumber: string,
  userId: string
): Promise<string> => {
  try {
    const call = await client.calls.create({
      url: `${process.env.BASE_URL}/twilio/voice?userId=${userId}&questionIndex=0`,
      to: phoneNumber,
      from: twilioConfig.phoneNumber,
    });

    return call.sid;
  } catch (error) {
    console.error('Error initiating call:', error);
    throw error;
  }
};

export const generateTwiMLForQuestion = (
  questionIndex: number,
  userId: string
): string => {
  const twiml = new VoiceResponse();

  if (questionIndex < setupQuestions.length) {
    twiml.say(
      { voice: 'Polly.Joanna' },
      `Question ${questionIndex + 1}: ${setupQuestions[questionIndex]}`
    );

    const gather = twiml.gather({
      input: ['speech'],
      action: `/twilio/response?userId=${userId}&questionIndex=${questionIndex}`,
      method: 'POST',
      speechTimeout: 'auto',
      speechModel: 'phone_call',
      language: 'en-IN',
    });

    gather.say({ voice: 'Polly.Joanna' }, 'Please speak your answer.');

    // If no input is received, retry
    twiml.redirect(
      `/twilio/voice?userId=${userId}&questionIndex=${questionIndex}`
    );
  } else {
    twiml.say(
      { voice: 'Polly.Joanna' },
      'Thank you for completing the setup questions. Your responses have been recorded. Goodbye!'
    );
    twiml.hangup();
  }

  return twiml.toString();
};
