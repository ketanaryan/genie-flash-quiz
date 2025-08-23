
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { subject, dayNumber, dayTarget, userInput } = await req.json()
    
    console.log(`Getting feedback for ${subject} - Day ${dayNumber}`)

    // Call Gemini API to get personalized feedback
    const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBBzb0nCGeCE6ok1WlMPePf-MK0GiCc9tk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an encouraging AI learning mentor. A student is learning "${subject}" and today is Day ${dayNumber}.

Today's target was: "${dayTarget}"

The student reported: "${userInput}"

Provide encouraging, personalized feedback (2-3 sentences max) that:
1. Acknowledges what they accomplished
2. Provides motivation and encouragement
3. Gives a helpful tip or next step if appropriate
4. Is warm and supportive in tone

Keep it concise, positive, and actionable. Use emojis to make it more engaging.`
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 200,
        }
      })
    })

    if (!geminiResponse.ok) {
      throw new Error('Failed to get feedback from Gemini')
    }

    const geminiData = await geminiResponse.json()
    const feedback = geminiData.candidates[0].content.parts[0].text

    return new Response(JSON.stringify({ feedback }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to get feedback' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
