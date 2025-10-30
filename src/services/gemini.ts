import Constants from 'expo-constants';

// Try different locations for expo config depending on managed/bare
const expoExtra = (Constants.expoConfig && Constants.expoConfig.extra) || (Constants.manifest && Constants.manifest.extra) || {};
const GEMINI_API_KEY = expoExtra.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

// Note: remove diagnostic logs in production. Keep silent if key not present.

export async function queryGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not set');
    return 'AI key not configured.';
  }

  const isApiKey = typeof GEMINI_API_KEY === 'string' && GEMINI_API_KEY.startsWith('AIza');
  const apiBaseCandidates = ['v1beta2', 'v1'];
  const modelCandidates = ['text-bison-001', 'models/text-bison-001'];
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (!isApiKey) headers.Authorization = `Bearer ${GEMINI_API_KEY}`;

  const payload = { prompt: { text: prompt }, temperature: 0.2, maxOutputTokens: 512 };

  try {
    for (const ver of apiBaseCandidates) {
      for (const model of modelCandidates) {
        const baseUrl = `https://generativelanguage.googleapis.com/${ver}`;
        const path = model.startsWith('models/') ? `${model}:generate` : `models/${model}:generate`;
        const url = isApiKey ? `${baseUrl}/${path}?key=${encodeURIComponent(GEMINI_API_KEY)}` : `${baseUrl}/${path}`;

        try {
          const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(payload) });
          if (!res.ok) {
            // try next candidate
            continue;
          }

          const data = await res.json();
          if (data?.candidates && data.candidates.length > 0) return data.candidates[0].content?.map((c: any) => c.text).join('') || JSON.stringify(data.candidates[0]);
          if (data?.output && data.output.length > 0) return data.output.map((o: any) => o.content?.map((c: any) => c.text).join('')).join('\n') || JSON.stringify(data.output);
          return JSON.stringify(data);
        } catch (e) {
          // continue trying other endpoints
          continue;
        }
      }
    }

    // Local fallback: simple heuristic responder (keeps UX alive)
    const q = prompt.toLowerCase();
    if (q.includes('crop')) return 'For crops, maintain NPK balance, regular irrigation, and pest monitoring.';
    if (q.includes('disease') || q.includes('pest')) return 'Try identifying the disease: upload clear images in Disease Detection; meanwhile remove affected leaves and apply recommended fungicide.';
    if (q.includes('price') || q.includes('market')) return 'Open Market Prices tab for latest rates; prices vary by region and grade.';
    if (q.includes('weather') || q.includes('rain')) return 'Check the Weather tab for 7-day forecast and prepare irrigation accordingly.';
    return 'I can help with crop selection, disease detection, market prices and profitability; please provide more details.';
  } catch (e) {
    console.error(e);
    return 'AI request failed';
  }
}
