<script setup lang="ts">
import TexElement from "@/components/TexElement.vue";
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

const getOptionContent = (option: string) => {
  // @ts-ignore
  return questionInfo.value?.questionData["answerOption" + option];
};
</script>

<template>
  <v-main>
    <v-container fixed style="max-width: 800px" v-if="questionInfo">
      <v-img :src="questionInfo.questionData.questionDiagramURL"></v-img>

      <v-container
        fixed
        style="max-width: 800px"
        v-if="questionInfo && questionInfo.questionData.questionTypeId == 1"
      >
        <v-card>
          <v-card-text>
            <TexElement :content="questionInfo.questionData.q_Latex" />
          </v-card-text>

          <v-card-text>
            <v-row
              class="d-flex"
              v-for="(option, index) in ['A', 'B', 'C', 'D']"
              :key="index"
            >
              <div class="d-flex justify-center align-center option">
                <div class="text-h6">({{ option }})</div>
                <TexElement :content="getOptionContent(option)" />
              </div>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>

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

<style scoped>
.option {
  margin: 0 1rem;
}

.option .text-h6 {
  margin: 0 0.5rem;
}
</style>
