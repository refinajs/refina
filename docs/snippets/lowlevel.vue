<template>
  <RunRefina root-id="lowlevel-root" />
</template>

<script lang="ts" setup>
import { app } from "refina";
import { onMounted } from "vue";
import RunRefina from "./run-refina.vue";

onMounted(() => {
  let count = 0;

  app(_ => {
    _._div(
      {
        id: "my-div",
      },
      _ => {
        _._p({}, `Count is: ${count}`);
        _._button(
          {
            onclick: () => {
              count++;
              _.$update();
            },
          },
          "Add",
        );
      },
    );
    _._svgSvg(
      {
        width: 100,
        height: 100,
      },
      _ => {
        _._svgPath({
          d: "M 10 10 H 90 V 90 H 10 Z",
          fill: "red",
        });
      },
    );
  }, "lowlevel-root");
});
</script>
