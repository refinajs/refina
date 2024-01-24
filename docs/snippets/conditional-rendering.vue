<template>
  <RunRefina root-id="conditional-rendering-root" />
</template>

<script lang="ts" setup>
import Basics from "@refina/basic-components";
import { $app } from "refina";
import { onMounted } from "vue";
import RunRefina from "./run-refina.vue";

onMounted(() => {
  let count = 0;

  $app({ plugins: [Basics], root: "#conditional-rendering-root" }, _ => {
    _.p(`Count is: ${count}`);

    _.button(`Add`) && count++;

    if (count > 0) {
      _.button("Reset") && (count = 0);
    }
  });
});
</script>
