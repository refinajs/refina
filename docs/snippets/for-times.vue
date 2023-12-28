<template>
  <RunRefina root-id="for-times-root" />
</template>

<script lang="ts" setup>
import Basics from "@refina/basic-components";
import { $app } from "refina";
import { onMounted } from "vue";
import RunRefina from "./run-refina.vue";

onMounted(() => {
  $app.use(Basics)(_ => {
    _.forTimes(5, index => {
      _.p(`This is the ${index + 1}th paragraph.`);
    });
  }, "for-times-root");
});
</script>
