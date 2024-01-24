<template>
  <RunRefina root-id="now-root" />
</template>

<script lang="ts" setup>
import Basics from "@refina/basic-components";
import { $app } from "refina";
import { onMounted } from "vue";
import RunRefina from "./run-refina.vue";

onMounted(() => {
  $app({ plugins: [Basics], root: "now-root" }, _ => {
    _.p(`The current time is ${_.now(500)}`);
  });
});
</script>
