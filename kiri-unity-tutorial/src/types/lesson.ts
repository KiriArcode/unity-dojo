export interface LessonMeta {
  title: string;
  slug: string;
  order?: number;
  category?: string;
  difficulty?: string;
  duration?: string;
  description?: string;
  tags?: string[];
}

export interface Lesson extends LessonMeta {
  content: string;
}
