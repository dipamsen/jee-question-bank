<script setup lang="ts">
import { useChaptersStore } from "@/stores/chapter";
import type { ChapterInfo, QuestionInfo } from "@/utils/types";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import QuestionViewer from "@/components/QuestionViewer.vue";

const store = useChaptersStore();

const questions = ref<ChapterInfo["questions"] | null>(null);

onMounted(async () => {
  // chapterInfo.value = await store.loadChapterInfo(+$route.params.chapterId);
});
</script>

<template>
  <v-main>
    <v-container fixed style="max-width: 800px" v-if="questions">
      <h1>All Questions</h1>

      <QuestionViewer :questions="questions" />
    </v-container>
    <v-progress-linear v-else indeterminate></v-progress-linear>
  </v-main>
</template>
