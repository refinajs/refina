<template>
  <RunRefina root-id="list-rendering-root" />
</template>

<script lang="ts" setup>
import Basics from "@refina/basic-components";
import { $app, bySelf } from "refina";
import { onMounted } from "vue";
import RunRefina from "./run-refina.vue";

onMounted(() => {
  const items = ["Apple", "Banana", "Orange"];

  $app.use(Basics)(_ => {
    _.for(items, bySelf, item => {
      _.p(item);
    });
  }, "list-rendering-root");
});
</script>
