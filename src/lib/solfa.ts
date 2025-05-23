// Solfa notation mapping
const SOLFA_NOTES = {
  'C': 'do',
  'D': 're',
  'E': 'mi',
  'F': 'fa',
  'G': 'sol',
  'A': 'la',
  'B': 'ti'
} as const;

// Voice part colors for visualization
export const VOICE_PART_COLORS = {
  soprano: '#FF6B6B',
  alto: '#4ECDC4',
  tenor: '#45B7D1',
  bass: '#96CEB4'
} as const;

export type VoicePart = keyof typeof VOICE_PART_COLORS;

// Convert a single note to solfa notation
export function convertNoteToSolfa(note: string): string {
  const upperNote = note.toUpperCase();
  return SOLFA_NOTES[upperNote as keyof typeof SOLFA_NOTES] || note;
}

// Convert a sequence of notes to solfa notation
export function convertToSolfa(notes: string[]): string[] {
  return notes.map(convertNoteToSolfa);
}

// Generate solfa notation from lyrics using OpenAI
export async function generateSolfaFromLyrics(
  lyrics: string,
  options: {
    key?: string;
    tempo?: number;
    style?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  } = {}
): Promise<Record<VoicePart, string[]>> {
  try {
    const response = await generateSolfaNotation({
      lyrics,
      ...options
    });

    // Validate the response
    const voiceParts = Object.keys(VOICE_PART_COLORS) as VoicePart[];
    for (const part of voiceParts) {
      if (!validateSolfaNotation(response[part])) {
        throw new Error(`Invalid solfa notation for ${part}`);
      }
      if (!checkVoiceRange(response[part], part)) {
        throw new Error(`Voice range violation for ${part}`);
      }
    }

    return {
      soprano: response.soprano,
      alto: response.alto,
      tenor: response.tenor,
      bass: response.bass
    };
  } catch (error) {
    console.error('Error generating solfa notation:', error);
    // Fallback to basic generation if AI fails
    return generateBasicSolfaNotation(lyrics);
  }
}

// Fallback function for basic solfa notation generation
function generateBasicSolfaNotation(lyrics: string): Record<VoicePart, string[]> {
  const words = lyrics.split(/\s+/);
  const notes = ['do', 're', 'mi', 'fa', 'sol', 'la', 'ti'];
  
  return {
    soprano: words.map((_, i) => notes[i % notes.length]),
    alto: words.map((_, i) => notes[(i + 2) % notes.length]),
    tenor: words.map((_, i) => notes[(i + 4) % notes.length]),
    bass: words.map((_, i) => notes[(i + 6) % notes.length])
  };
}

// Generate voice part notations with proper voice leading
export function generateVoicePartNotations(
  lyrics: string,
  voiceParts: VoicePart[]
): Record<VoicePart, string[]> {
  const baseNotation = generateBasicSolfaNotation(lyrics);
  
  return voiceParts.reduce((acc, part) => {
    acc[part] = baseNotation[part];
    return acc;
  }, {} as Record<VoicePart, string[]>);
} 