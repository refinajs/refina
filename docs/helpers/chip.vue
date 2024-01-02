<template>
  <div class="chip" :style="`background-color: var(--vp-c-${color}-soft);`">
    <slot></slot>
  </div>
</template>
<script lang="ts">
export default {
  props: {
    color: {
      type: String,
      required: true,
    },
  },
};
</script>
<style scoped>
.chip {
  display: inline-block;
  border-radius: 5px;
  padding: 2px 6px;
  font-weight: 500;
  font-family: var(--vp-font-family-mono);
}
</style>
