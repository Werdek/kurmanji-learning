import type { Exercise, LessonStatus, ReviewDomain } from "@/content/schema";

export function exerciseKindLabel(kind: Exercise["kind"]): string {
  switch (kind) {
    case "multipleChoice":
      return "Multiple choice";
    case "fillInTheBlank":
      return "Fill in the blank";
    case "sentenceBuilder":
      return "Build the sentence";
    case "vocabularyMatch":
      return "Match pairs";
  }
}

export function skillLabel(skill: ReviewDomain): string {
  return {
    recognition: "Recognition",
    production: "Production",
    listening: "Listening",
    grammar: "Grammar",
  }[skill];
}

export function lessonStatusLabel(status: LessonStatus): string {
  return {
    playable: "Ready",
    authoring: "In authoring",
  }[status];
}
