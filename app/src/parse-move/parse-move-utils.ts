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
