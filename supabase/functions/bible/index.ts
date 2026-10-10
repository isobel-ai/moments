// Edge function: bible
// Proxies the api.bible REST API so the api key never lives in the client.
//
// Actions:
//   books    -> GET /bibles/{bibleId}/books
//   chapters -> GET /bibles/{bibleId}/books/{bookId}/chapters
//   verses   -> GET /bibles/{bibleId}/chapters/{chapterId}/verses
//   passage  -> GET /bibles/{bibleId}/passages/{passageId}

const API_BIBLE_KEY = Deno.env.get('API_BIBLE_KEY')!;
const API_BIBLE_BASE = 'https://rest.api.bible/v1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

function buildUrl(action: string, params: Record<string, string>): string {
  const { bibleId, bookId, chapterId, passageId } = params;

  switch (action) {
    case 'books':
      return `${API_BIBLE_BASE}/bibles/${bibleId}/books`;
    case 'chapters':
      return `${API_BIBLE_BASE}/bibles/${bibleId}/books/${bookId}/chapters`;
    case 'verses':
      return `${API_BIBLE_BASE}/bibles/${bibleId}/chapters/${chapterId}/verses`;
    case 'passage':
      return `${API_BIBLE_BASE}/bibles/${bibleId}/passages/${passageId}`;
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, bibleId, bookId, chapterId, passageId } = await req.json();

    if (!action || !bibleId) {
      return new Response(
        JSON.stringify({ error: 'action and bibleId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const url = buildUrl(action, { bibleId, bookId, chapterId, passageId });

    const apiRes = await fetch(url, {
      headers: { 'api-key': API_BIBLE_KEY },
    });

    if (!apiRes.ok) {
      return new Response(
        JSON.stringify({ error: `api.bible request failed (${apiRes.status})` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const data = await apiRes.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
