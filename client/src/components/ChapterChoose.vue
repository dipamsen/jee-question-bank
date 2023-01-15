<script setup lang="ts">
import { ref, onMounted, watchEffect } from "vue";
import { useChaptersStore } from "../stores/chapter";

const props = defineProps<{
  subject: "physics" | "chemistry" | "maths";
}>();

const store = useChaptersStore();

const theme = ref("dark");

const chapters = ref<any[]>([]);

// watchEffect(async (onCleanup) => {
//   const controller = new AbortController();
//   const signal = controller.signal;
//   chapters.value = [];
//   onCleanup(() => {
//     controller.abort();
//   });
//   const response = await fetch(
//     `${import.meta.env.VITE_API_URL}/chapters?subject=${
//       props.subject
//     }&grade=11`,
//     {
//       signal,
//     }
//   );
//   chapters.value = await response.json();
// });
</script>

<template>
  <v-sheet class="ma-2 px-4 py-2" rounded>
    <h2>Choose a Chapter</h2>
    <v-chip-group column selected-class="text-primary">
      <v-chip
        v-for="chapter of store.chapters[subject]"
        :key="chapter.chapterId"
        variant="outlined"
      >
        {{ chapter.chapterName }}
      </v-chip>
    </v-chip-group>
  </v-sheet>
</template>

<style scoped>
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}
</style>
