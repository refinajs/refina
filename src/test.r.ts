import { d, view } from "./lib";
const on = d(false);
const t = d("hello world");
let n = 4;
view((_) => {
  _.$cls`${on.value ? "bg-blue-500" : ""}`;
  _._h1({}, t);
  if (_.button("Toggle")) on.value = !on.value;
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
 */
