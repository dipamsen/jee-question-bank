<script setup lang="ts">
import { ref, onMounted, watchEffect } from "vue";
import { useChaptersStore } from "../stores/chapter";

const props = defineProps<{
  subject: "physics" | "chemistry" | "maths";
}>();

const store = useChaptersStore();

const theme = ref("dark");

const chapters = ref<any[]>([]);
</script>

<template>
  <h2>Choose a Chapter</h2>
  <v-card
    elevation="5"
    v-for="chapter of store.chapters[subject]"
    :key="chapter.chapterId"
    :value="chapter.courseChapterId"
    :title="chapter.chapterName"
    class="mb-4"
  >
    <v-divider />
    <v-card-actions>
      <v-btn color="primary" :to="`/chapter/${chapter.courseChapterId}`">
        Browse All Questions
      </v-btn>

      <v-btn color="primary" :to="`/chapter/${chapter.courseChapterId}/topic`">
        View Topicwise Questions
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}
</style>
