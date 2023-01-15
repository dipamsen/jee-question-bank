<script setup lang="ts">
import { ref, watchEffect } from "vue";
import ChapterChoose from "@/components/ChapterChoose.vue";

const subject = ref("physics");
</script>

<template>
  <v-main>
    <v-container fixed style="max-width: 800px">
      <v-tabs color="primary" v-model="subject">
        <v-tab value="physics">Physics</v-tab>
        <v-tab value="chemistry">Chemistry</v-tab>
        <v-tab value="maths">Maths</v-tab>
      </v-tabs>

      <ChapterChoose :subject="subject" />
    </v-container>
  </v-main>
</template>
