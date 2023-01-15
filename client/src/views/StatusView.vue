<script setup lang="ts">
import {
  onMounted,
  ref,
  reactive,
  watchEffect,
  type Ref,
  onBeforeUnmount,
  onUnmounted,
} from "vue";
import { useChaptersStore } from "../stores/chapter";

const store = useChaptersStore();

const loaded = ref(false);

// @ts-expect-error: Object.entries is not a function
const subjects = Object.entries(store.chapters).map(([sb, chaps]) => ({
  name: sb,
  chapters: chaps,
}));

const compStatus = reactive<Record<string, number[]>>({
  physics: [],
  chemistry: [],
  maths: [],
});

onMounted(async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/comp-status`);
  const status = await response.json();
  for (const sb of ["physics", "chemistry", "maths"]) {
    compStatus[sb] = status[sb];
  }

  loaded.value = true;
});

const updateStatus = async () => {
  await fetch(`${import.meta.env.VITE_API_URL}/comp-status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completedChaps: compStatus }),
  });
  snackbar.value = true;
};

const snackbar = ref(false);

const editable = ref(false);

function toggleEditable() {
  editable.value = !editable.value;
}
</script>

<template>
  <v-main>
    <v-container fixed style="max-width: 800px" v-if="loaded">
      <div v-for="subject in subjects">
        <v-row justify="space-between">
          <h1 class="upper">{{ subject.name }}</h1>

          <v-progress-circular
            :size="50"
            :model-value="
              (100 * compStatus[subject.name].length) / subject.chapters.length
            "
            color="primary"
            >{{
              (
                (100 * compStatus[subject.name].length) /
                subject.chapters.length
              ).toFixed(0)
            }}%</v-progress-circular
          >
        </v-row>

        <v-checkbox
          v-for="chapter of subject.chapters"
          color="primary"
          hide-details
          :disabled="!editable"
          :key="chapter.courseChapterId"
          v-model="compStatus[subject.name]"
          :value="chapter.courseChapterId"
          :label="chapter.chapterName"
        />
        <v-divider class="mt-4 mb-8" />
      </div>
      <v-row>
        <v-btn class="ma-2" @click="toggleEditable()">{{
          !editable ? "Edit" : "Cancel"
        }}</v-btn>
        <v-btn class="ma-2" @click="updateStatus()" :disabled="!editable"
          >Update</v-btn
        >
      </v-row>

      <v-dialog model="snackbar">Updated Successfully!</v-dialog>
    </v-container>
    <v-progress-linear v-else indeterminate></v-progress-linear>
  </v-main>
</template>

<style>
.upper {
  text-transform: capitalize;
}
</style>
