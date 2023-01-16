import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import type { Chapter, ChapterInfo, QuestionInfo } from "../utils/types";
const API_URL = import.meta.env.VITE_API_URL;

export const useChaptersStore = defineStore("chapters", () => {
  const chapters = reactive<{
    physics: Chapter[];
    chemistry: Chapter[];
    maths: Chapter[];
  }>({ physics: [], chemistry: [], maths: [] });

  const chapterInfos = reactive(new Map<number, ChapterInfo>());

  const chaptersLoaded = ref<boolean>(false);

  const loadChapters = async () => {
    if (chaptersLoaded.value) return;
    const subjects: ["physics", "chemistry", "maths"] = [
      "physics",
      "chemistry",
      "maths",
    ];
    for (const subject of subjects) {
      const res = await fetch(
        `${API_URL}/chapters?grade=11&subject=${subject}`
      );
      const allChapters: Chapter[] = await res.json();
      chapters[subject] = allChapters;
    }

    chaptersLoaded.value = true;
  };

  const loadChapterInfo = async (chapterId: number) => {
    if (chapterInfos.has(chapterId))
      return chapterInfos.get(chapterId) as ChapterInfo;
    const res = await fetch(`${API_URL}/questions?chapter=${chapterId}`);
    const chapterInfo: ChapterInfo = await res.json();

    chapterInfos.set(chapterId, chapterInfo);

    return chapterInfo;
  };

  const questionsInfo = reactive(new Map<number, QuestionInfo>());
  const loadQuestionInfo = async (questionId: number) => {
    if (questionsInfo.has(questionId))
      return questionsInfo.get(questionId) as QuestionInfo;
    const res = await fetch(`${API_URL}/question?id=${questionId}`);
    const questionInfo: QuestionInfo = await res.json();
    questionsInfo.set(questionId, questionInfo);
    return questionInfo;
  };

  return {
    chapters,
    loadChapters,
    chaptersLoaded,

    chapterInfos,
    loadChapterInfo,

    questionsInfo,
    loadQuestionInfo,
  };
});
