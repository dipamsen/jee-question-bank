<script setup lang="ts">
import { useChaptersStore } from "@/stores/chapter";
import type { ChapterInfo } from "@/utils/types";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import QuestionViewer from "@/components/QuestionViewer.vue";

const $route = useRoute();

const store = useChaptersStore();

const chapterInfo = ref<ChapterInfo | null>(null);

onMounted(async () => {
  chapterInfo.value = await store.loadChapterInfo(+$route.params.chapterId);
});
</script>

<template>
  <v-main>
    <v-container fixed style="max-width: 800px" v-if="chapterInfo">
      <h1>{{ chapterInfo.chapter.ChapterName }}</h1>

      <QuestionViewer :questions="chapterInfo.questions" />
    </v-container>
    <v-progress-linear v-else indeterminate></v-progress-linear>
  </v-main>
</template>
