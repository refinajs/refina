<template>
  <RunRefina root-id="counter-root" />
</template>

<script lang="ts" setup>
import Basics from "@refina/basic-components";
import { $app } from "refina";
import { onMounted } from "vue";
import RunRefina from "./run-refina.vue";

onMounted(() => {
  let count = 0;

  $app({ plugins: [Basics], root: "#counter-root" }, _ => {
    _.button(`Count is: ${count}`) && count++;
  });
});
</script>
