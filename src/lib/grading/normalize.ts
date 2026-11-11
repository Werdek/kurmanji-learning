/**
 * Answer normalisation for Kurdish (Hawar orthography).
 *
 * Diacritics are significant: i/î, e/ê, u/û, s/ş and c/ç are different
 * letters. We normalise punctuation, spacing, case and apostrophe shape only.
 */
export function normalizeKurdish(value: string): string {
  return value
    .normalize("NFC")
    .replace(/[’‘`´]/g, "'")
    .replace(/[.,!?;:…"“”«»]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function stripDiacritics(value: string): string {
  return normalizeKurdish(value)
    .replace(/ê/g, "e")
    .replace(/î/g, "i")
    .replace(/û/g, "u")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c");
}

export function sameAnswer(a: string, b: string): boolean {
  return normalizeKurdish(a) === normalizeKurdish(b);
}

export function countWords(value: string): number {
  const normalized = normalizeKurdish(value);
  return normalized.length === 0 ? 0 : normalized.split(" ").length;
}
