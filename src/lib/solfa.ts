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

// Generate solfa notation from lyrics (basic implementation)
export function generateSolfaFromLyrics(lyrics: string): string[] {
  // This is a simplified version. In a real implementation, you would:
  // 1. Use a music theory API or algorithm to determine the notes
  // 2. Consider the key and scale
  // 3. Handle different voice parts
  
  // For now, we'll return a placeholder pattern
  const words = lyrics.split(/\s+/);
  return words.map((word, index) => {
    const notes = ['do', 're', 'mi', 'fa', 'sol', 'la', 'ti'];
    return notes[index % notes.length];
  });
}

// Generate voice part notations
export function generateVoicePartNotations(
  lyrics: string,
  voiceParts: VoicePart[]
): Record<VoicePart, string[]> {
  const baseNotation = generateSolfaFromLyrics(lyrics);
  
  return voiceParts.reduce((acc, part) => {
    // In a real implementation, each voice part would have its own melody
    // For now, we'll just offset the base notation
    const offset = {
      soprano: 0,
      alto: -2,
      tenor: -4,
      bass: -6
    }[part];

    acc[part] = baseNotation.map((note, index) => {
      const notes = ['do', 're', 'mi', 'fa', 'sol', 'la', 'ti'];
      const currentIndex = notes.indexOf(note);
      const newIndex = (currentIndex + offset + 7) % 7;
      return notes[newIndex];
    });

    return acc;
  }, {} as Record<VoicePart, string[]>);
} 