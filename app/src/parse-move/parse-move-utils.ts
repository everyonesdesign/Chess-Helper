export interface MatchData {
  toProcess: string;
  lastMatch: string;
}
export function matchTail(input: MatchData, options: string[]): boolean {
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    const isMatch = input.toProcess.endsWith(option);
    if (isMatch) {
      input.toProcess = input.toProcess.slice(0, -option.length);
      input.lastMatch = option;
      return true;
    }
  }
  return false;
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
