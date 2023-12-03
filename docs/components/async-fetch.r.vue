<template>
  <button @click="run" class="run-btn" :disabled="running">Run Example</button>
  <RunRefina v-if="running" root-id="async-fetch-root" />
</template>

<script lang="ts" setup>
import Basics from "@refina/basic-components";
import { app } from "refina";
import { onUpdated, ref } from "vue";
import RunRefina from "./run-refina.vue";

const running = ref(false);

const run = () => {
  running.value = true;
  setTimeout(() => {
    app.use(Basics)(_ => {
      if (
        _.await(() => fetch("https://jsonplaceholder.typicode.com/todos/1"))
      ) {
        // When the promise is fulfilled, _.await returns true.

        _.p(_.$awaited.statusText);

        // You can also use a custom id for a nesting await call.
        _.await(() => _.$awaited.text(), "Text") && _.p(_.$awaitedText);
      } else {
        // When the promise is pending, _.await returns false.

        _.p("Loading...");
      }
    }, "async-fetch-root");
  }, 10);
};
</script>
<style scoped>
.run-btn {
  margin-bottom: 1rem;
  padding: 0.3rem 1rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
}
.run-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
