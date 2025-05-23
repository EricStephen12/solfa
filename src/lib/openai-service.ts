import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface SolfaGenerationOptions {
  lyrics: string;
  key?: string;
  tempo?: number;
  style?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

interface SolfaResponse {
  soprano: string[];
  alto: string[];
  tenor: string[];
  bass: string[];
  key: string;
  tempo: number;
  style: string;
}

const SYSTEM_PROMPT = `You are a music theory expert specializing in solfa notation. Your task is to generate solfa notation for choir music.
Follow these rules:
1. Use only do, re, mi, fa, sol, la, ti
2. Consider proper voice ranges for each part
3. Create harmonically correct progressions
4. Follow traditional voice leading rules
5. Return the response in JSON format with arrays for each voice part
6. Include key, tempo, and style information

Voice ranges:
- Soprano: C4-A5
- Alto: G3-E5
- Tenor: C3-G4
- Bass: E2-C4`;

export async function generateSolfaNotation(options: SolfaGenerationOptions): Promise<SolfaResponse> {
  const { lyrics, key = 'C', tempo = 120, style = 'traditional', difficulty = 'intermediate' } = options;

  const userPrompt = `Generate solfa notation for the following lyrics:
Lyrics: "${lyrics}"
Key: ${key}
Tempo: ${tempo}
Style: ${style}
Difficulty: ${difficulty}

Please provide the notation for all four voice parts (soprano, alto, tenor, bass) following proper music theory rules.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content);
    return response as SolfaResponse;
  } catch (error) {
    console.error('Error generating solfa notation:', error);
    throw new Error('Failed to generate solfa notation');
  }
}

// Helper function to validate solfa notation
export function validateSolfaNotation(notation: string[]): boolean {
  const validNotes = ['do', 're', 'mi', 'fa', 'sol', 'la', 'ti'];
  return notation.every(note => validNotes.includes(note.toLowerCase()));
}

// Helper function to check voice range
export function checkVoiceRange(notation: string[], voicePart: string): boolean {
  const ranges = {
    soprano: { min: 'do', max: 'la' },
    alto: { min: 'sol', max: 'mi' },
    tenor: { min: 'do', max: 'sol' },
    bass: { min: 'mi', max: 'do' }
  };

  const range = ranges[voicePart as keyof typeof ranges];
  return notation.every(note => {
    const noteIndex = ['do', 're', 'mi', 'fa', 'sol', 'la', 'ti'].indexOf(note.toLowerCase());
    const minIndex = ['do', 're', 'mi', 'fa', 'sol', 'la', 'ti'].indexOf(range.min);
    const maxIndex = ['do', 're', 'mi', 'fa', 'sol', 'la', 'ti'].indexOf(range.max);
    return noteIndex >= minIndex && noteIndex <= maxIndex;
  });
} 