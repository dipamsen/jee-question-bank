<script setup lang="ts">
import { defineProps, ref, watch } from "vue";
import katex from "katex";
// @ts-ignore
import renderMathInElement from "katex/dist/contrib/auto-render.mjs";

const props = defineProps<{
  content: string;
}>();

const elt = ref(null);
const rendered = ref(false);

watch(elt, () => {
  if (elt.value && !rendered.value) {
    renderMathInElement(elt.value, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false },
        { left: "$", right: "$", display: false },
      ],
    });
    rendered.value = true;
  }
});
</script>

<template>
  <div>
    <div v-html="content" ref="elt"></div>
  </div>
</template>
