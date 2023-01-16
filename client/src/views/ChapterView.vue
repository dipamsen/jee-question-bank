<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { useChaptersStore } from "../stores/chapter";
import { useRoute } from "vue-router";
import type { Chapter, ChapterInfo } from "../utils/types";

const $route = useRoute();

const store = useChaptersStore();

const chapterInfo = ref<ChapterInfo | null>(null);

onMounted(async () => {
  chapterInfo.value = await store.loadChapterInfo(+$route.params.chapterId);
  console.log(chapterInfo.value);
});
</script>

<template>
  <v-main>
    <v-container fixed style="max-width: 800px" v-if="chapterInfo">
      <h1>{{ chapterInfo.chapter.ChapterName }}</h1>
    </v-container>
    <v-progress-linear v-else></v-progress-linear>
  </v-main>
</template>
