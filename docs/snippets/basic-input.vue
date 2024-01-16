<template>
  <RunRefina root-id="basic-input-root" />
</template>

<script lang="ts" setup>
import Basics from "@refina/basic-components";
import { $app, model } from "refina";
import { onMounted } from "vue";
import RunRefina from "./run-refina.vue";

onMounted(() => {
  const username = model("");

  $app.use(Basics)(_ => {
    _.label("Username");
    _.textInput(username, false, "edit me");
    username.value.length && _.button("Clear") && (username.value = "");
    _.p(`Your username is: ${username.value}`);
  }, "basic-input-root");
});
</script>
