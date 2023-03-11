<script setup lang="ts">
import { useChaptersStore } from "@/stores/chapter";
import type { QuestionInfo } from "@/utils/types";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const store = useChaptersStore();

const $route = useRoute();

const questionInfo = ref<QuestionInfo | null>(null);

onMounted(async () => {
  questionInfo.value = await store.loadQuestionInfo(+$route.params.qId);
  console.log(questionInfo.value);
});
</script>

<template>
  <v-main>
    <v-container fixed style="max-width: 800px" v-if="questionInfo">
      <v-img :src="questionInfo.questionData.questionDiagramURL"></v-img>
      <v-row>
        <v-col
          class="d-flex justify-center"
          v-for="letter in ['A', 'B', 'C', 'D']"
        >
          <v-btn color="secondary" variant="tonal">{{ letter }}</v-btn>
        </v-col>
      </v-row>

      <v-card>
        <v-card-text>
          <v-card-subtitle>Answer</v-card-subtitle>
          <v-card-title>
            {{ questionInfo.questionData.answerOption }}
          </v-card-title>
        </v-card-text>

        <v-img :src="questionInfo.questionData.fullSolutionURL" />
      </v-card>
    </v-container>
    <v-progress-linear v-else indeterminate></v-progress-linear>
  </v-main>
</template>
