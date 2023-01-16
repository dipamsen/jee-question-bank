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

      <h2>Browse All Questions</h2>
      <div class="or">OR</div>
      <h2>View Topicwise Questions</h2>
      <v-card
        v-for="topic in chapterInfo.kscClusterNames"
        :title="topic.KSCClusterName"
        :subtitle="
          chapterInfo.questions.filter(
            (q) => q.KSCClusterId === topic.KSCClusterId
          ).length + ' questions'
        "
        :key="topic.KSCClusterId"
        class="mb-4"
      >
        <v-divider />
        <v-card-actions>
          <v-btn color="primary">Browse Questions</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
    <v-progress-linear v-else indeterminate></v-progress-linear>
  </v-main>
</template>

<style>
.or {
  display: flex;
  justify-content: center;
  align-items: center;
}

.or:after,
.or:before {
  content: "";
  display: block;
  background: grey;
  width: 100%;
  height: 1px;
  margin: 0 10px;
}
</style>
