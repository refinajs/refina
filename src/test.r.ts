import { Button, d, ref, view } from "./lib";
const on = d(false);
const t = d.trim("hello world");
let n = 4;
const btn = ref<Button>();
view((_) => {
  _.$cls`${on.value ? "bg-blue-500" : ""}`;
  _._pre({}, `$${t}$`);
  if (_.$ref(btn) && _.button("Toggle")) on.value = !on.value;
  if (_.button("+")) n++;
  _._t(n);
  if (_.button("-")) n--;
  _.textInput("Type here: ", t);
  _.textInput("Type here2: ", t);
  _.forRange(n, (i) => _._p({}, i));
});

/*
   if (_.textInput("Type here: ", t)) {
    _._p({}, "Input is focused!");
  }

  <script setup>
import { ref } from 'vue';
const on = ref(false);
const t = ref("Hello world");
const n = ref(0);
</script>
<template>
  <h1 :style="on ? `background-color:blue` : ``">{{ t }}</h1>
  <button @click="on = !on">Toggle</button>
  <button @click="n++">+</button>
  {{ n }}
  <button @click="n--">-</button>
  Type here: <input v-model="t">
  <p v-for="i in n" :key="i">
    {{ i }}
  </p>
</template>
 */
