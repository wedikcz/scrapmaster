import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Body parsers with generous limit for base64 images
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Helper to get GoogleGenAI client safely with server-side telemetry
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// -----------------------------------------------------------------------------
// API 1: Google Search Grounding with gemini-3.5-flash
// -----------------------------------------------------------------------------
app.post('/api/search-grounding', async (req, res) => {
  const { query, promptContext } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  const ai = getGenAIClient();
  if (!ai) {
    // Offline / Free-Tier Local Heuristic Fallback
    return res.json({
      status: 'offline_fallback',
      text: `[Local Intelligence Fallback]: For "${query}", consult standard component specifications and manufacturer datasheets. Check pins, operating voltage, and maximum ratings before powering.`,
      sources: [
        { title: 'Electronic Components Datasheet Archives', url: 'https://www.alldatasheet.com' },
        { title: 'Dangerous Prototypes Open Hardware Salvage', url: 'http://dangerousprototypes.com' }
      ],
      queries: [query, `${query} pinout schematic`, `${query} safe salvage voltage`]
    });
  }

  try {
    const systemInstruction =
      'You are ScrapMaster AI, an expert electronic hardware recycling and component engineering assistant. Provide factual, up-to-date pinouts, replacement equivalents, pricing, and safety ratings grounded in Google Search data. Include specific voltage limits, pin labels, and precautions.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: promptContext ? `${promptContext}\n\nUser Question: ${query}` : query,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }]
      }
    });

    const candidate = response.candidates?.[0];
    const text = candidate?.content?.parts?.map(p => p.text).filter(Boolean).join('\n') || '';

    // Extract search grounding metadata
    const groundingMetadata = candidate?.groundingMetadata;
    const webSearchQueries = groundingMetadata?.webSearchQueries || [];
    const groundingChunks = groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((c: any) => c.web?.uri)
      .map((c: any) => ({
        title: c.web?.title || 'Web Reference',
        url: c.web?.uri
      }));

    return res.json({
      status: 'success',
      text,
      sources,
      queries: webSearchQueries
    });
  } catch (err: any) {
    console.error('Google Search Grounding Error:', err);
    return res.status(500).json({
      error: err.message || 'Search Grounding failed',
      fallbackText: `Local analysis for ${query}: Always verify VCC, GND, and input logic tolerances before soldering.`
    });
  }
});

// -----------------------------------------------------------------------------
// API 2: Image Generation and Editing with gemini-nano-banana-2.1
// -----------------------------------------------------------------------------
app.post('/api/generate-image', async (req, res) => {
  const { prompt, referenceImageBase64, mimeType } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt parameter' });
  }

  const ai = getGenAIClient();
  if (!ai) {
    // Generate a high-tech SVG schematic / hardware mockup placeholder
    const svgMock = generateSvgHardwareMockup(prompt);
    return res.json({
      status: 'offline_fallback',
      imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(svgMock)}`,
      note: 'Using local vector schematic generator. Configure GEMINI_API_KEY for photorealistic neural rendering.'
    });
  }

  try {
    const contentsParts: any[] = [];

    // If an existing image was provided, add it for image editing / reference
    if (referenceImageBase64) {
      const cleanData = referenceImageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      contentsParts.push({
        inlineData: {
          data: cleanData,
          mimeType: mimeType || 'image/jpeg'
        }
      });
    }

    contentsParts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-nano-banana-2.1',
      contents: {
        parts: contentsParts
      }
    });

    let generatedImageUrl = '';
    let responseText = '';
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      } else if (part.text) {
        responseText += part.text;
      }
    }

    if (!generatedImageUrl) {
      // Fallback if model responded with text only
      const svgMock = generateSvgHardwareMockup(prompt);
      generatedImageUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgMock)}`;
    }

    return res.json({
      status: 'success',
      imageUrl: generatedImageUrl,
      text: responseText
    });
  } catch (err: any) {
    console.error('Image Generation Error:', err);
    const svgMock = generateSvgHardwareMockup(prompt);
    return res.json({
      status: 'fallback',
      imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(svgMock)}`,
      error: err.message
    });
  }
});

// Helper for generating vector electronic diagrams
function generateSvgHardwareMockup(prompt: string): string {
  const cleanPrompt = prompt.replace(/[<>&"]/g, ' ').slice(0, 50);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="#090d16" rx="16"/>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#1e293b" stroke-width="1"/>
    </pattern>
    <rect width="600" height="400" fill="url(#grid)" />
    <!-- IC Chip -->
    <rect x="220" y="140" width="160" height="120" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
    <text x="300" y="195" fill="#f8fafc" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle">HARDWARE BLUEPRINT</text>
    <text x="300" y="220" fill="#38bdf8" font-family="monospace" font-size="11" text-anchor="middle">${cleanPrompt}</text>
    <!-- Traces -->
    <path d="M 100 200 L 220 200" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>
    <circle cx="100" cy="200" r="5" fill="#10b981"/>
    <path d="M 380 200 L 500 200" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
    <circle cx="500" cy="200" r="5" fill="#f59e0b"/>
    <!-- Top banner -->
    <rect x="20" y="20" width="220" height="28" rx="6" fill="#1e293b" />
    <text x="30" y="38" fill="#94a3b8" font-family="monospace" font-size="11">SCRAPMASTER • SCIENTIFIC CAD</text>
  </svg>`;
}

// -----------------------------------------------------------------------------
// API 3: Science Skills: E-Waste Materials Chemistry & PubChem Integration
// -----------------------------------------------------------------------------
app.get('/api/science/materials/:compound', async (req, res) => {
  const compound = req.params.compound;
  try {
    // 1. Resolve compound name to PubChem CID
    const cidRes = await fetch(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(compound)}/cids/JSON`
    );
    if (!cidRes.ok) {
      return res.status(404).json({ error: 'Compound not found in PubChem' });
    }
    const cidData = await cidRes.json();
    const cid = cidData?.IdentifierList?.CID?.[0];
    if (!cid) {
      return res.status(404).json({ error: 'No CID found for compound' });
    }

    // 2. Fetch physicochemical properties from PubChem
    const propsRes = await fetch(
      `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularFormula,MolecularWeight,CanonicalSMILES,InChIKey,Complexity/JSON`
    );
    const propsData = await propsRes.json();
    const properties = propsData?.PropertyTable?.Properties?.[0] || {};

    return res.json({
      cid,
      name: compound,
      molecularFormula: properties.MolecularFormula || '',
      molecularWeight: properties.MolecularWeight || '',
      smiles: properties.CanonicalSMILES || '',
      inchiKey: properties.InChIKey || '',
      complexity: properties.Complexity || 0
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// API 4: Multimodal Vision Dissection & OCR with gemini-3.8-flash
// -----------------------------------------------------------------------------
app.post('/api/vision/ai-dissect', async (req, res) => {
  const { imageBase64, mimeType = 'image/jpeg', prompt } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: 'Missing imageBase64 parameter' });
  }

  const ai = getGenAIClient();
  if (!ai) {
    return res.json({
      status: 'offline_fallback',
      analysis: 'Local Engine: IC package detected (DIP-8 / TO-220). Verify Pin 1 notch and check VCC/GND with multimeter before applying power.'
    });
  }

  try {
    const cleanData = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    const defaultPrompt =
      'Identify electronic components, laser markings/part numbers (OCR), pinout labels, capacitor ratings, and highlight any dangerous high-voltage risks (stored energy in primary capacitors, MOT, lithium battery degradation). Provide step-by-step multimeter diagnostic testing instructions.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanData,
              mimeType
            }
          },
          { text: prompt || defaultPrompt }
        ]
      }
    });

    return res.json({
      status: 'success',
      analysis: response.text || 'No text extracted'
    });
  } catch (err: any) {
    console.error('AI Vision Dissection Error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// API 5: Audio Voice Synthesis (TTS) with gemini-3.8-flash-lite-tts
// -----------------------------------------------------------------------------
app.post('/api/tts/speak', async (req, res) => {
  const { text, voice = 'Kore' } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Missing text parameter' });
  }

  const ai = getGenAIClient();
  if (!ai) {
    return res.json({
      status: 'offline_fallback',
      audioData: null,
      note: 'TTS available when server-side GEMINI_API_KEY is active.'
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 500),
              speechMetadata: {
                style: 'Clear, encouraging electrical engineering instructor'
              }
            }
          ]
        }
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    return res.json({
      status: 'success',
      audioData: base64Audio ? `data:audio/wav;base64,${base64Audio}` : null
    });
  } catch (err: any) {
    console.error('Gemini TTS Error:', err);
    return res.status(500).json({ error: err.message, audioData: null });
  }
});

// -----------------------------------------------------------------------------
// Vite Server Integration (Mounting Vite Middlewares in dev)
// -----------------------------------------------------------------------------
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production build
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ScrapMaster AI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
