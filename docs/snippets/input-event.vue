<template>
  <RunRefina root-id="input-event-root" />
</template>

<script lang="ts" setup>
import Basics from "@refina/basic-components";
import { $app } from "refina";
import { onMounted } from "vue";
import RunRefina from "./run-refina.vue";

onMounted(() => {
  $app({ plugins: [Basics], root: "#input-event-root" }, _ => {
    _.label("Username");
    if (_.textInput(sessionStorage.getItem("username") ?? "")) {
      sessionStorage.setItem("username", _.$ev);
    }
  });
});
</script>
