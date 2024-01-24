import { $app } from "refina";
import Basics from "@refina/basic-components";

// Should declare states here?

$app([Basics], _ => {
  // Or here?

  _.p("Count is 0!");
});

declare module "refina" {
  interface Plugins {
    Basics: typeof Basics;
  }
}
