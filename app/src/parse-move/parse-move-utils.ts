export function matchStringTail(input: string, options: string[]): [string, string] | null {
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    const isMatch = input.endsWith(option);
    if (isMatch) {
      return [input.slice(0, -option.length), option];
    }
  }
  return null;
}

export function isFile(input: string): boolean {
  const code = input.charCodeAt(0);
  return code >= 97 && code <= 104;
}

export function isRank(input: string): boolean {
  const code = input.charCodeAt(0);
  return code >= 49 && code <= 56;
}

const PROMOTION_PIECE_LOOKUP: Record<string, boolean> = {
  b: true,
  n: true,
  r: true,
  q: true,
  B: true,
  N: true,
  R: true,
  Q: true,
};
export function isPromotionPiece(input: string): boolean {
  return PROMOTION_PIECE_LOOKUP[input] || false;
}

const PIECE_LOOKUP: Record<string, boolean> = {
  ...PROMOTION_PIECE_LOOKUP,
  k: true,
  K: true,
};
export function isPiece(input: string): boolean {
  return PIECE_LOOKUP[input] || false;
}

export function sanitizeInput(moveString: string) : string {
  // Remove
  // - spaces
  // - captures
  // - check
  // - mate
  // - supplemental promotion and castling characters
  // - other special characters
  return moveString.replace(/[\sx#\+\-=\\\/!@#$%^&*()_]+/g, '');
}
