
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { subject, duration_days } = await req.json()
    
    const authHeader = req.headers.get('Authorization')!
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Get the user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    console.log(`Creating roadmap for ${subject} - ${duration_days} days`)

    // Call Gemini API to generate roadmap
    const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBBzb0nCGeCE6ok1WlMPePf-MK0GiCc9tk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Create a detailed ${duration_days}-day learning roadmap for "${subject}". 
            
            Return ONLY a JSON object in this exact format:
            {
              "days": [
                {
                  "day": 1,
                  "title": "Getting Started with ${subject}",
                  "target": "Complete basic setup and understand fundamentals",
                  "resources": ["Resource 1", "Resource 2", "Resource 3"]
                }
              ]
            }
            
            Make sure each day has:
            - Progressive difficulty
            - Clear, actionable targets
            - 3-5 helpful resources (books, websites, tutorials)
            - Practical exercises when possible
            
            Focus on real-world application and hands-on learning. Make it engaging and achievable for a beginner.`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    })

    if (!geminiResponse.ok) {
      throw new Error('Failed to generate roadmap with Gemini')
    }

    const geminiData = await geminiResponse.json()
    const generatedText = geminiData.candidates[0].content.parts[0].text

    // Parse the JSON from Gemini response
    let roadmapData
    try {
      // Clean up the response in case there's markdown formatting
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        roadmapData = JSON.parse(jsonMatch[0])
      } else {
        roadmapData = JSON.parse(generatedText)
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError)
      throw new Error('Failed to parse AI response')
    }

    // Ensure we have the right number of days
    if (roadmapData.days.length !== duration_days) {
      // Adjust the roadmap to match requested days
      if (roadmapData.days.length > duration_days) {
        roadmapData.days = roadmapData.days.slice(0, duration_days)
      } else {
        // If we have fewer days, duplicate some content
        while (roadmapData.days.length < duration_days) {
          const lastDay = roadmapData.days[roadmapData.days.length - 1]
          roadmapData.days.push({
            ...lastDay,
            day: roadmapData.days.length + 1,
            title: `${lastDay.title} - Extended Practice`
          })
        }
      }
    }

    // Save to database
    const { data, error } = await supabase
      .from('learning_roadmaps')
      .insert({
        user_id: user.id,
        subject,
        duration_days,
        roadmap_data: roadmapData
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    return new Response(JSON.stringify({ success: true, roadmap: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to create roadmap' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
