<script setup lang="ts">
import { onMounted, ref, reactive, watchEffect, type Ref } from "vue";

const subjects = ref<any[]>([]);

const compStatus = reactive<Record<string, number[]>>({
  physics: [],
  chemistry: [],
  maths: [],
});

// onMounted(async () => {
for (const sb of ["physics", "chemistry", "maths"]) {
  const obj: any = {};
  obj.name = sb;
  const response = await fetch(
    "http://localhost:3000/chapters?subject=" + sb + "&grade=11"
  );
  const chapters = await response.json();
  obj.chapters = chapters;
  subjects.value.push(obj);
}

const response = await fetch(`${import.meta.env.VITE_API_URL}/comp-status`);
const status = await response.json();
for (const sb of ["physics", "chemistry", "maths"]) {
  compStatus[sb] = status[sb];
}

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
    <v-container fixed style="max-width: 800px">
      <div v-for="subject in subjects">
        <h1 class="upper">{{ subject.name }}</h1>
        <!-- <v-chip-group
          column
          multiple
          selected-class="text-primary"
          v-model="compStatus[subject.name]"
        > -->
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

        <!-- </v-chip-group> -->
      </div>
      <v-row>
        <v-btn @click="toggleEditable()" block>{{
          !editable ? "Edit" : "Cancel"
        }}</v-btn>
        <v-btn @click="updateStatus()">Update</v-btn>
      </v-row>

      <v-snackbar model="snackbar">Updated Successfully!</v-snackbar>
    </v-container>
  </v-main>
</template>

<style>
.upper {
  text-transform: uppercase;
}
</style>
