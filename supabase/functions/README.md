# Edge functions

Supabase Edge Functions (Deno) for the moments platform.

## Functions

| Function | Description |
| --- | --- |
| `transcribe` | Transcribes an audio file using the OpenAI Whisper API and stores the transcript. |
| `signed-url` | Generates a signed URL for a private audio or artwork object. |

## Local development

```bash
supabase functions serve
```

## Deploy

```bash
supabase functions deploy transcribe
supabase functions deploy signed-url
```

## Secrets

Set the required secrets in the Supabase dashboard or via the CLI:

```bash
supabase secrets set OPENAI_API_KEY=sk-...
```
