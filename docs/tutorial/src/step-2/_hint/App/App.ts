import { $app } from "refina";
import Basics from "@refina/basic-components";

$app([Basics], _ => {
  _.h1("Hello, world!");
  _.p(_ => {
    _.t`This is a `;
    _.a("link", "https://refina.dev");
    _.t`.`;
  });
});

declare module "refina" {
  interface Plugins {
    Basics: typeof Basics;
  }
}
