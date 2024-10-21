export function Capitalize(text: string): any {
  try {
    if (!text) return "";
    return text[0].toLocaleUpperCase() + text.slice(1);
  } catch (error) {
    console.error(error);
  }
}
