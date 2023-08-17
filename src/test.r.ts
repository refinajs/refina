import { HTMLElementComponent } from "./dom";
import { bySelf, d, ref, view } from "./lib";
const on = d(false);
const t = d.trim("hello world");
let n = 4;
const p = ref<HTMLElementComponent<"p">>();
let s = [1, 2, 3];
function ff(): never {
  throw new Error("test");
}
view((_) => {
  _.ul(s, bySelf, (i) => {
    if (_._cbButton({}, i as string)) {
      if (_.$.onClick()) {
        console.log("+", _.$state, i);
        n += i as number;
      }
      if (_.$.onContextmenu()) {
        n -= i as number;
        console.log(_.$.$ev);
        _.$.$preventDefault();
      }
    }
  });
  if (_.h1(`${on}` + n)) {
    console.log(_.$);
  }
  if ((() => false as const)()) {
    addEventListener;
  }
  if (_.checkbox("ON/OFF")) {
    _.p("ON");
  }
  _.br();
  if (_.checkbox("ON/OFF")) {
    _.p("ON");
  }
  // if (_.toggleButton("1")) {
  //   _.$clear(p);
  //   if (_.$ref(p)) {
  //     _.$;
  //     _._p({}, "MENU" + n);
  //   }
  //   if (_.button("!!!")) {
  //     _.$;
  //     _.$ref(p);
  //   }
  //   if (_.cbButton("!11")) {
  //     _.$ev;
  //     _.$;
  //     if (_.$.onClick()) {
  //       _.$toggle();
  //     }
  //     _.$ref(ref<{ a: 111 }>());
  //   }
  //   //&& _.$ &&
  // }
  // _.$cls`${on.value ? "bg-blue-500" : ""}`;
  // _._pre({}, `$${t}$`);
  // if (_.$ref(btn) && _.button("Toggle")) on.value = !on.value;
  // if (_.button("+")) n++;
  // _._t(n);
  // if (_.button("-")) n--;

  // if (_._cbButton({}, "LR click")) {
  //   if (_.$.onClick()) {
  //     n++;
  //   }
  //   if (_.$.onContextmenu()) {
  //     _.$.$ev.preventDefault();
  //     n = 0;
  //   }
  // }
  // _._p({}, n);
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

  // if (_.button("ABC")) {
  //   n++;
  //   _.$ev;
  // }
  // _.$ev;
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
