<template>
  <RunRefina root-id="event-handling-root" />
</template>

<script lang="ts" setup>
import Basics from "@refina/basic-components";
import { $app } from "refina";
import { onMounted } from "vue";
import RunRefina from "./run-refina.vue";

onMounted(() => {
  let count = 0;

  $app({ plugins: [Basics], root: "#event-handling-root" }, _ => {
    _.p(`Count is: ${count}`);

    _.button(`Add`) && count++;

    if (_.button("Reset")) {
      count = 0;
      console.log(_.$ev);
    }
  });
});
</script>
