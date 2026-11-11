import { z } from "zod";

/**
 * Content contracts for the course. Every Kurdish string that reaches a
 * learner is attached to a source reference and a review status, per
 * LINGUISTIC_RESOURCES.md and CURRICULUM_MATRIX.md §11.
 */

export const stages = ["A1.1", "A1.2", "A2.1", "A2.2", "B1.1", "B1.2"] as const;
export type Stage = (typeof stages)[number];

export const reviewDomains = [
  "recognition",
  "production",
  "listening",
  "grammar",
] as const;
export type ReviewDomain = (typeof reviewDomains)[number];

export const reviewStatuses = [
  "draft",
  "checked",
  "native-reviewed",
  "verified",
] as const;
export type ReviewStatus = (typeof reviewStatuses)[number];

const sourceRefSchema = z
  .string()
  .regex(
    /^(TH|CHY|RIZ|BED1970|IKP|HAWAR|SRC-[A-Z0-9-]+)\b/,
    "Use a registered source id, e.g. 'TH §11' or 'CHY'.",
  );

const reviewKeySchema = z
  .string()
  .regex(
    /^(G[0-9]{2}|lex\.[a-z0-9-]+)$/,
    "Review keys must be a grammar id (G03) or a lexeme id (lex.silav).",
  );

export const reviewTargetSchema = z
  .object({
    key: reviewKeySchema,
    domain: z.enum(reviewDomains),
  })
  .strict();
export type ReviewTarget = z.infer<typeof reviewTargetSchema>;

export const lexemeSchema = z
  .object({
    id: z.string().regex(/^lex\.[a-z0-9-]+$/),
    ku: z.string().min(1),
    en: z.string().min(1),
    pos: z.enum([
      "noun",
      "verb",
      "adjective",
      "adverb",
      "pronoun",
      "interjection",
      "phrase",
      "proper-noun",
      "number",
      "particle",
      "preposition",
    ]),
    gender: z.enum(["m", "f", "m/f", "pl"]).optional(),
    notes: z.string().optional(),
    variants: z.array(z.string().min(1)).default([]),
    sourceRefs: z.array(sourceRefSchema).min(1),
    reviewStatus: z.enum(reviewStatuses),
    dialect: z.enum(["standard", "amed", "qamishli"]).default("standard"),
  })
  .strict();
export type Lexeme = z.infer<typeof lexemeSchema>;

export const grammarPointSchema = z
  .object({
    id: z.string().regex(/^G[0-9]{2}$/),
    title: z.string().min(3),
    stage: z.enum(stages),
    rule: z.string().min(30),
    examples: z
      .array(
        z
          .object({
            ku: z.string().min(1),
            en: z.string().min(1),
          })
          .strict(),
      )
      .min(1),
    commonErrors: z.array(z.string().min(3)).default([]),
    sourceRefs: z.array(sourceRefSchema).min(1),
    reviewStatus: z.enum(reviewStatuses),
  })
  .strict();
export type GrammarPoint = z.infer<typeof grammarPointSchema>;

const exerciseBaseSchema = z.object({
  id: z.string().regex(/^ex\.[a-z0-9.-]+$/),
  lessonId: z.string().regex(/^u[0-9]{2}-l[1-6]$/),
  prompt: z.string().min(3),
  explanation: z.string().min(20),
  hints: z.array(z.string().min(3)).max(3).default([]),
  skill: z.enum(reviewDomains),
  difficulty: z.number().int().min(1).max(3),
  sourceRefs: z.array(sourceRefSchema).min(1),
  reviewStatus: z.enum(reviewStatuses),
  reviewTargets: z.array(reviewTargetSchema).min(1),
  tags: z.array(z.string().min(1)).default([]),
});

export const multipleChoiceSchema = exerciseBaseSchema
  .extend({
    kind: z.literal("multipleChoice"),
    options: z
      .array(
        z
          .object({
            id: z.string().min(1),
            text: z.string().min(1),
          })
          .strict(),
      )
      .min(2)
      .max(6),
    correctOptionId: z.string().min(1),
    optionExplanations: z.record(z.string(), z.string()).default({}),
  })
  .strict();

export const fillInTheBlankSchema = exerciseBaseSchema
  .extend({
    kind: z.literal("fillInTheBlank"),
    before: z.string(),
    after: z.string().default(""),
    accepted: z.array(z.string().min(1)).min(1),
    displayAnswer: z.string().min(1),
    translation: z.string().min(1),
  })
  .strict();

export const sentenceBuilderSchema = exerciseBaseSchema
  .extend({
    kind: z.literal("sentenceBuilder"),
    tokens: z.array(z.string().min(1)).min(2),
    distractors: z.array(z.string().min(1)).default([]),
    translation: z.string().min(1),
    punctuation: z.enum([".", "?", "!"]).default("."),
  })
  .strict();

export const vocabularyMatchSchema = exerciseBaseSchema
  .extend({
    kind: z.literal("vocabularyMatch"),
    pairs: z
      .array(
        z
          .object({
            ku: z.string().min(1),
            en: z.string().min(1),
            reviewKey: reviewKeySchema,
          })
          .strict(),
      )
      .min(3)
      .max(6),
  })
  .strict();

export const exerciseSchema = z.discriminatedUnion("kind", [
  multipleChoiceSchema,
  fillInTheBlankSchema,
  sentenceBuilderSchema,
  vocabularyMatchSchema,
]);
export type Exercise = z.infer<typeof exerciseSchema>;
export type MultipleChoiceExercise = z.infer<typeof multipleChoiceSchema>;
export type FillInTheBlankExercise = z.infer<typeof fillInTheBlankSchema>;
export type SentenceBuilderExercise = z.infer<typeof sentenceBuilderSchema>;
export type VocabularyMatchExercise = z.infer<typeof vocabularyMatchSchema>;

export const lessonStatuses = ["playable", "authoring"] as const;
export type LessonStatus = (typeof lessonStatuses)[number];

export const lessonSchema = z
  .object({
    id: z.string().regex(/^u[0-9]{2}-l[1-6]$/),
    unitId: z.string().regex(/^u[0-9]{2}$/),
    index: z.number().int().min(1).max(6),
    titleKu: z.string().min(1),
    titleEn: z.string().min(1),
    subtitle: z.string().min(3),
    inputDialogue: z
      .array(
        z
          .object({
            speaker: z.string().min(1),
            ku: z.string().min(1),
            en: z.string().min(1),
          })
          .strict(),
      )
      .default([]),
    objectives: z.array(z.string().min(3)).min(1),
    estimatedMinutes: z.number().int().min(10).max(45),
    exerciseIds: z.array(z.string()).default([]),
    status: z.enum(lessonStatuses),
    sourceRefs: z.array(sourceRefSchema).min(1),
    reviewStatus: z.enum(reviewStatuses),
  })
  .strict()
  .superRefine((lesson, ctx) => {
    if (lesson.status === "playable" && lesson.exerciseIds.length < 6) {
      ctx.addIssue({
        code: "custom",
        message: "Playable lessons need at least 6 exercises.",
        path: ["exerciseIds"],
      });
    }
    if (new Set(lesson.exerciseIds).size !== lesson.exerciseIds.length) {
      ctx.addIssue({
        code: "custom",
        message: "Duplicate exercise ids in lesson.",
        path: ["exerciseIds"],
      });
    }
  });
export type Lesson = z.infer<typeof lessonSchema>;

export const unitSchema = z
  .object({
    id: z.string().regex(/^u[0-9]{2}$/),
    stage: z.enum(stages),
    order: z.number().int().min(1).max(3),
    titleKu: z.string().min(1),
    titleEn: z.string().min(1),
    description: z.string().min(10),
    outcomes: z.array(z.string().min(3)).min(3),
    lessonIds: z.array(z.string()).length(6),
    grammarRefs: z.array(z.string().regex(/^G[0-9]{2}$/)).min(1),
    lexemeRefs: z.array(z.string().regex(/^lex\.[a-z0-9-]+$/)).min(1),
  })
  .strict();
export type Unit = z.infer<typeof unitSchema>;

export type ContentBundle = {
  units: Unit[];
  lessons: Lesson[];
  exercises: Exercise[];
  lexemes: Lexeme[];
  grammarPoints: GrammarPoint[];
};

export function parseOrThrow<T>(
  schema: z.ZodType<T>,
  value: unknown,
  label: string,
): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    const detail = result.error.issues
      .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("; ");
    throw new Error(`${label} failed content validation — ${detail}`);
  }
  return result.data;
}
