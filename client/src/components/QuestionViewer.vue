<script setup lang="ts">
import type { ChapterInfo } from "@/utils/types";
import { ref, computed, watchEffect } from "vue";

const props = defineProps<{
  questions: ChapterInfo["questions"];
}>();

const questionPerPage = ref(20);

const currentPage = ref(1);

const selectedDifficulty = ref<string[]>([]);
const selectedQuestionType = ref<string[]>([]);
const selectedKSCCluster = ref<string[]>([]);
const selectedLevel = ref<string[]>([]);

const difficultyOptions = ["Easy", "Basic", "Normal", "Hard", "Tough"];
const questionTypeOptions = ["Objective", "Multiple Choice", "Numerical"];
const levelOptions = ["JEE Main", "JEE Advanced"];

const firstQuestion = computed(() => {
  return (currentPage.value - 1) * questionPerPage.value;
});
const lastQuestion = computed(() => {
  return Math.min(
    currentPage.value * questionPerPage.value,
    renderedQuestions.value.length
  );
});

const kscClusterNames = new Set(props.questions.map((q) => q.kscClusterName));

const renderedQuestions = ref(props.questions);

const applyFilters = (): Promise<ChapterInfo["questions"]> =>
  new Promise((resolve, reject) => {
    if (
      selectedDifficulty.value.length === 0 &&
      selectedQuestionType.value.length === 0 &&
      selectedKSCCluster.value.length === 0 &&
      selectedLevel.value.length !== 1
    ) {
      return resolve(props.questions);
    }
    const output = props.questions.filter((q) => {
      if (selectedDifficulty.value.length > 0) {
        if (!selectedDifficulty.value.includes(q.DifficultyGroup)) {
          return false;
        }
      }
      if (selectedQuestionType.value.length > 0) {
        if (!selectedQuestionType.value.includes(q.QuestionType)) {
          return false;
        }
      }
      if (selectedKSCCluster.value.length > 0) {
        if (!selectedKSCCluster.value.includes(q.kscClusterName)) {
          return false;
        }
      }
      if (selectedLevel.value.length == 1) {
        if (selectedLevel.value[0] === "JEE Main") {
          return q.level == 1;
        }
        if (selectedLevel.value[0] === "JEE Advanced") {
          return q.level == 2;
        }
      }
      return true;
    });
    resolve(output);
  });

async function filterData() {
  loading.value = true;
  renderedQuestions.value = await applyFilters();
  currentPage.value = 1;
  loading.value = false;
}

const loading = ref(false);

watchEffect(() => {
  console.log(loading);
});
</script>

<template>
  <v-row>
    <v-col cols="12" md="3">
      <v-select
        multiple
        v-model="selectedDifficulty"
        :items="difficultyOptions"
        label="Difficulty"
        chips
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
    <v-col cols="12" md="3">
      <v-select
        v-model="selectedLevel"
        chips
        :items="levelOptions"
        label="Question Level"
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

  <!-- pagination -->
  <v-pagination
    v-model="currentPage"
    :length="Math.ceil(renderedQuestions.length / questionPerPage)"
  ></v-pagination>

  <v-spacer class="my-2"></v-spacer>

  <div class="d-flex space-between">
    <p class="text-disabled">
      Show
      <select v-model="questionPerPage" class="text-disabled">
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="80">80</option>
      </select>
      questions on one page
    </p>
    <p class="text-disabled text-right mb-2">
      Showing questions {{ firstQuestion + 1 }} - {{ lastQuestion }} out of
      {{ renderedQuestions.length }} questions
    </p>
  </div>

  <v-card
    v-for="question in renderedQuestions.slice(
      firstQuestion,
      firstQuestion + questionPerPage
    )"
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
      <p>
        {{ question.QuestionType }} | {{ question.DifficultyGroup }} | Level
        {{ question.level }}
      </p>
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

  <v-pagination
    v-model="currentPage"
    :length="Math.ceil(renderedQuestions.length / questionPerPage)"
  ></v-pagination>
</template>

<style>
.space-between {
  justify-content: space-between;
}
</style>
