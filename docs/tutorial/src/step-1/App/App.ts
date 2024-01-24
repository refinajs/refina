import { $app } from "refina";
import Basics from "@refina/basic-components";

$app([Basics], _ => {
  _.h1("👋 Hello, Refina!");
});

declare module "refina" {
  interface Plugins {
    Basics: typeof Basics;
  }
}
