import type { Exercise } from "@/content/schema";
import type { ExerciseResult } from "@/lib/grading";

export type WidgetProps<T extends Exercise> = {
  exercise: T;
  disabled: boolean;
  onSubmit: (result: ExerciseResult) => void;
};
