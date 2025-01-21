import { createEvent } from '../supabaseClient';

export async function generateDisputeLetter(formData) {
  const gptResponse = await createEvent('chatgpt_request', {
    prompt: `Generate a parking dispute letter using this structured data:
    Vehicle Make: ${formData.vehicleMake}
    Vehicle Model: ${formData.vehicleModel}
    Ticket Number: ${formData.ticketNumber}
    Ticket Date: ${formData.ticketDate}
    Ticket Reason: ${formData.ticketReason}
    Circumstances: ${formData.circumstances}

    Return response as valid JSON with EXACTLY these fields:
    {
      "letter": "Full professional letter text using legal terminology",
      "summary": "Bullet point summary of key legal arguments"
    }`,
    response_type: 'json'
  });

  if (!gptResponse || typeof gptResponse !== 'object') {
    throw new Error('Invalid AI response structure');
  }

  const { letter, summary } = gptResponse;
  
  if (!letter || !summary) {
    throw new Error(`Missing required fields in AI response. Received: ${JSON.stringify(gptResponse)}`);
  }

  return { letter, summary };
}
