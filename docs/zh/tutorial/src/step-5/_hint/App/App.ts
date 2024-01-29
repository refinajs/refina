import { $app } from "refina";
import Basics from "@refina/basic-components";
let count = 0;
$app([Basics], _ => {
  _.h1(`You have clicked the button ${count} times.`);
  if (_.button("Click me!")) {
    count++;
  }
});
declare module "refina" {
  interface Plugins {
    Basics: typeof Basics;
  }
}