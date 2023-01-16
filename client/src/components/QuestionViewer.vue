<script setup lang="ts">
import type { ChapterInfo } from "@/utils/types";
import { ref, computed, watchEffect } from "vue";

const props = defineProps<{
  questions: ChapterInfo["questions"];
}>();

const myWorker = new Worker("/worker.js");

const selectedDifficulty = ref<string[]>([]);
const selectedQuestionType = ref<string[]>([]);
const selectedKSCCluster = ref<string[]>([]);

const difficultyOptions = ["Easy", "Basic", "Normal", "Hard", "Tough"];
const questionTypeOptions = ["Objective", "Multiple Choice", "Numerical"];
const kscClusterNames = new Set(props.questions.map((q) => q.kscClusterName));

const renderedQuestions = ref(props.questions);

const applyFilters = (): Promise<ChapterInfo["questions"]> =>
  new Promise((resolve, reject) => {
    // if (
    //   selectedDifficulty.value.length === 0 &&
    //   selectedQuestionType.value.length === 0 &&
    //   selectedKSCCluster.value.length === 0
    // ) {
    //   return resolve(props.questions);
    // }
    // const output = props.questions.filter((q) => {
    //   if (selectedDifficulty.value.length > 0) {
    //     if (!selectedDifficulty.value.includes(q.DifficultyGroup)) {
    //       return false;
    //     }
    //   }
    //   if (selectedQuestionType.value.length > 0) {
    //     if (!selectedQuestionType.value.includes(q.QuestionType)) {
    //       return false;
    //     }
    //   }
    //   if (selectedKSCCluster.value.length > 0) {
    //     if (!selectedKSCCluster.value.includes(q.kscClusterName)) {
    //       return false;
    //     }
    //   }
    //   return true;
    // });
    // resolve(output);
  });

async function filterData() {
  loading.value = true;

  myWorker.postMessage({
    questions: JSON.stringify(props.questions),
    selectedDifficulty: JSON.stringify(selectedDifficulty.value),
    selectedQuestionType: JSON.stringify(selectedQuestionType.value),
    selectedKSCCluster: JSON.stringify(selectedKSCCluster.value),
  });
  myWorker.onmessage = (e) => {
    renderedQuestions.value = e.data;
    loading.value = false;
    myWorker.onmessage = null;
  };
}

const loading = ref(false);

watchEffect(() => {
  console.log(loading);
});
</script>

<template>
  <!-- filters -->
  <v-row>
    <v-col cols="12" md="3">
      <v-select
        v-model="selectedDifficulty"
        :items="difficultyOptions"
        label="Difficulty"
        chips
        multiple
        hide-details
      ></v-select>
    </v-col>
    <v-col cols="12" md="3">
      <v-select
        v-model="selectedQuestionType"
        :items="questionTypeOptions"
        chips
        label="Question Type"
        multiple
        hide-details
      ></v-select>
    </v-col>
    <v-col cols="12" md="3" v-if="kscClusterNames.size < 10">
      <v-select
        v-model="selectedKSCCluster"
        chips
        :items="[...kscClusterNames]"
        label="Topic"
        multiple
        hide-details
      ></v-select>
    </v-col>
    <v-col cols="12" md="3" class="d-flex justify-center align-center">
      <v-btn
        :loading="loading"
        color="primary"
        variant="tonal"
        @click="filterData"
      >
        Filter
      </v-btn>
    </v-col>
  </v-row>

  <v-spacer class="my-2"></v-spacer>

  <p class="text-disabled text-right mb-2">
    Showing {{ renderedQuestions.length }} questions
  </p>

  <v-card
    v-for="question in renderedQuestions"
    :key="question.QuestionId"
    class="mb-4"
  >
    <v-img
      :src="`https://questionkscimagestorage.blob.core.windows.net${question.QuestionDiagramURL.slice(
        1
      )}`"
    ></v-img>
    <v-card-text>
      <p>{{ question.chapterName }} ({{ question.kscClusterName }})</p>
      <p>{{ question.QuestionType }}</p>
      <p>{{ question.DifficultyGroup }}</p>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-btn
        color="primary"
        variant="tonal"
        :to="`/question/${question.QuestionId}`"
        >View</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
