import { Button, d, ref, view } from "./lib";
const on = d(false);
const t = d.trim("hello world");
let n = 4;
const btn = ref<Button>();
view((_) => {
  // _.$cls`${on.value ? "bg-blue-500" : ""}`;
  // _._pre({}, `$${t}$`);
  // if (_.$ref(btn) && _.button("Toggle")) on.value = !on.value;
  // if (_.button("+")) n++;
  // _._t(n);
  // if (_.button("-")) n--;

  // if (_.cbButton("LR click")) {
  //   if (_.$.onClick()) {
  //     console.log(_.$.$ev);
  //     n++;
  //   }
  //   if (_.$.onContextmenu()) {
  //     console.log(_.$.$ev);
  //     n = 0;
  //   }
  // }
  // if (_._cbButton({}, "LR click2")) {
  //   if (_.$.onClick()) {
  //     console.log(_.$.$ev);
  //     n++;
  //   }
  //   if (_.$.onContextmenu()) {
  //     console.log(_.$.$ev);
  //     n = 0;
  //   }
  // }
  // if (_.toggleButton("1")) {
  //   if (_.toggleButton("2")) {
  //     if (_.toggleButton("3")) {
  //       if (_.toggleButton("4")) {
  //         if (_.toggleButton("5")) {
  //           _._p({}, "MENU");
  //         }
  //       }
  //     }
  //   }
  // }
  if (_.button("ABC")) {
    n++;
  }
  _._p({}, "MENU" + n);
  //_._t("1111111")
  // _.textInput("Type here: ", t);
  // _.textInput("Type here2: ", t);
  // _.forRange(n, (i) => _._p({}, i));
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
