/** Escape terminal controls while retaining structured newline/tab content for wrapping. */
export const terminalText = (text: string) => text.replace(/[\u0000-\u0008\u000b-\u001f\u007f-\u009f\u2028\u2029\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/g,
  character => `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`);

/** Inline values cannot create renderer-owned line breaks or indentation. */
export const inlineText = (text: string) => terminalText(text).replace(/[\n\t]/g,
  character => `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`);
