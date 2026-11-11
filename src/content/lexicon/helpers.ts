/**
 * Compact lexeme factory for the A2 lexicon files.
 *
 * The A1 files spell out every field. A2 adds several hundred words, so a
 * small helper keeps the vocabulary readable and the metadata consistent.
 */

import type { Lexeme } from "../schema";

type Pos = Lexeme["pos"];
type Gender = NonNullable<Lexeme["gender"]>;

export function lx(
  id: string,
  ku: string,
  en: string,
  pos: Pos,
  gender?: Gender,
  sourceRefs: readonly string[] = ["CHY"],
) {
  return {
    id,
    ku,
    en,
    pos,
    ...(gender ? { gender } : {}),
    sourceRefs: [...sourceRefs],
    reviewStatus: "checked" as const,
  };
}
