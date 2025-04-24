import * as Sentry from '@sentry/node';
import { authenticateUser } from "./_apiUtils.js";

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.VITE_PUBLIC_APP_ID
    }
  }
});

export default async function handler(req, res) {
  try {
    console.log('API: Generate letter request received');
    
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Authenticate the user
    const user = await authenticateUser(req);
    console.log(`API: User authenticated: ${user.id}`);

    // Get form data from the request
    const formData = req.body;
    if (!formData) {
      return res.status(400).json({ error: 'Form data is required' });
    }

    // Check if OpenAI API key is set
    const openAiApiKey = process.env.OPENAI_API_KEY;
    if (!openAiApiKey) {
      console.error('API: OpenAI API key is not configured');
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }

    console.log('API: Calling OpenAI API for letter generation');
    
    // Call OpenAI API with enhanced prompt
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o", // or another appropriate model
        messages: [
          {
            role: "system",
            content: `You are a legal expert specializing in parking ticket disputes. You have deep knowledge of parking regulations, traffic laws, and the legal frameworks governing parking enforcement in ${formData.country || 'various countries'}. Your expertise extends to both public and private parking enforcement, procedural requirements, and common grounds for successful disputes. Provide responses in JSON format.`
          },
          {
            role: "user",
            content: `Generate a comprehensive, professional and extensive parking dispute letter using this structured data:
            Vehicle Make: ${formData.vehicleMake}
            Vehicle Model: ${formData.vehicleModel}
            Vehicle Registration: ${formData.vehicleReg}
            Ticket Number: ${formData.ticketNumber}
            Ticket Date: ${formData.ticketDate}
            Ticket Reason: ${formData.ticketReason}
            Country: ${formData.country || 'Not specified'}
            Registered Keeper Address: ${formData.keeperAddress}
            Parking Company/Authority Address: ${formData.companyAddress}
            Circumstances: ${formData.circumstances}
            
            The letter should be formatted as a detailed formal dispute letter, including:
            1. The current date at the top
            2. The recipient's address (Parking Company/Authority)
            3. Your address (Registered Keeper)
            4. A reference line with ticket number and vehicle registration
            5. A formal salutation
            6. An extensive body covering:
               - Clear introduction stating the purpose of the letter
               - Detailed factual account of events
               - Comprehensive legal and procedural grounds for dispute
               - Specific references to relevant laws, guidelines or precedents in ${formData.country || 'the relevant jurisdiction'}
               - Discussion of any procedural errors or technical defects in the ticket issuance
               - Analysis of any mitigating circumstances
               - Counter-arguments to anticipated responses
               - Strong concluding statements
            7. A formal closing with clear request for the penalty to be cancelled
            
            Make this letter extremely comprehensive and professional, drawing on country-specific legal frameworks where possible. The letter should be extensive enough to demonstrate significant value to justify the £4.00 cost. Include appropriate legal terminology and citations relevant to parking enforcement in ${formData.country || 'the appropriate jurisdiction'}.
            
            Return response as valid JSON with EXACTLY these fields:
            {
              "letter": "Full extensive professional letter text using sophisticated legal terminology and country-specific regulations",
              "summary": "Detailed bullet point summary of all key legal arguments and procedural points"
            }`
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API: OpenAI API error', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log("API: OpenAI API response received");
    
    // Extract the content from the response
    const content = data.choices[0]?.message?.content;
    if (!content) {
      console.error('API: No content in OpenAI response');
      throw new Error("No content in OpenAI response");
    }
    
    // Parse the JSON string from the content
    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (error) {
      console.error("API: Failed to parse OpenAI response:", content);
      Sentry.captureException(error);
      throw new Error("Failed to parse OpenAI response format");
    }
    
    // Validate the required fields
    const { letter, summary } = parsedContent;
    if (!letter || !summary) {
      console.error('API: Missing required fields in AI response', parsedContent);
      throw new Error(`Missing required fields in AI response. Received: ${JSON.stringify(parsedContent)}`);
    }

    // Return the generated letter and summary
    console.log("API: Letter generation successful");
    res.status(200).json({ letter, summary });
  } catch (error) {
    console.error("API: AI service error:", error);
    Sentry.captureException(error);
    res.status(500).json({ error: error.message || 'Failed to generate letter' });
  }
}