import { $app, model } from "refina";
import Basics from "@refina/basic-components";
const name = model("");
$app([Basics], _ => {
  _.textInput(name);
  if (name.value.length > 0) {
    _.button("Clear") && (name.value = "");
  }
  _.p(`Hello ${name}!`);
});
declare module "refina" {
  interface Plugins {
    Basics: typeof Basics;
  }
}