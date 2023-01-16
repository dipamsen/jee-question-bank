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
  <v-list column selected-class="text-primary">
    <v-list-item
      elevation="1"
      v-for="chapter of store.chapters[subject]"
      :key="chapter.chapterId"
      :value="chapter.courseChapterId"
      :title="chapter.chapterName"
      :to="`/chapter/${chapter.courseChapterId}`"
    >
    </v-list-item>
  </v-list>
</template>

<style scoped>
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}
</style>
