import { defineStore } from "pinia";
import { reactive, ref } from "vue";

interface Chapter {
  chapterId: number;
  courseChapterId: number;
  chapterName: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export const useChaptersStore = defineStore("chapters", () => {
  const chapters = reactive<{
    physics: Chapter[];
    chemistry: Chapter[];
    maths: Chapter[];
  }>({ physics: [], chemistry: [], maths: [] });

  const loaded = ref<boolean>(false);

  const loadChapters = async () => {
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
    loaded.value = true;
  };

  return {
    chapters,
    loadChapters,
    loaded,
  };
});
