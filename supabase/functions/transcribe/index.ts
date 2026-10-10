// Edge function: transcribe
// Transcribes an audio file from the private `audio` bucket using the OpenAI
// Whisper API, then updates the moment's transcript.

import { createClient } from 'npm:@supabase/supabase-js@2';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { momentId, audioPath } = await req.json();

    if (!momentId || !audioPath) {
      return new Response(
        JSON.stringify({ error: 'momentId and audioPath are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Download the audio from the private bucket.
    const { data: file, error: downloadError } = await supabase.storage
      .from('audio')
      .download(audioPath);

    if (downloadError || !file) {
      return new Response(
        JSON.stringify({ error: 'Failed to download audio' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Send to Whisper.
    const form = new FormData();
    form.append('file', file, audioPath.split('/').pop() ?? 'audio.m4a');
    form.append('model', 'whisper-1');

    const whisperRes = await fetch(
      'https://api.openai.com/v1/audio/transcriptions',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
        body: form,
      },
    );

    if (!whisperRes.ok) {
      return new Response(
        JSON.stringify({ error: 'Transcription failed' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const { text } = await whisperRes.json();

    // Store the transcript on the moment.
    const { error: updateError } = await supabase
      .from('moments')
      .update({ transcript: text, transcribed: true })
      .eq('id', momentId);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to save transcript' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(JSON.stringify({ transcript: text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
