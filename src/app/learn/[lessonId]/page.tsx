import { notFound } from "next/navigation";
import { LessonScreen } from "@/components/lesson-screen";
import { getLesson, getLessonExercises, playableLessons } from "@/content";

export function generateStaticParams() {
  return playableLessons.map((lesson) => ({ lessonId: lesson.id }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);

  if (!lesson || lesson.status !== "playable") {
    notFound();
  }

  return (
    <LessonScreen lesson={lesson} exercises={getLessonExercises(lesson.id)} />
  );
}
