import { $app } from "refina";
import Basics from "@refina/basic-components";
let count = 0;
$app([Basics], _ => {
  // Not here!

  _.p(`Count is ${count}!`);
});
declare module "refina" {
  interface Plugins {
    Basics: typeof Basics;
  }
}