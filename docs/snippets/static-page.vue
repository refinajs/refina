<template>
  <RunRefina root-id="static-page-root" />
</template>

<script lang="ts" setup>
import Basics from "@refina/basic-components";
import { $app } from "refina";
import { onMounted } from "vue";
import RunRefina from "./run-refina.vue";

onMounted(() => {
  $app.use(Basics)(_ => {
    _.$css`color: red`;
    _.h1("Hello, Refina!");

    _.$css`border: 1px solid yellow`;
    _.div(_ => {
      _.p("This is a paragraph.");
      _.p(_ => _.img("https://picsum.photos/200/300", "placeholder"));
    });
  }, "static-page-root");
});
</script>
