import { $app } from "refina";
import Basics from "@refina/basic-components";
import PartView from "./PartView";

$app([Basics], _ => {
  _.h1("Title");
  _(PartView)("Part 1", "Content 1");
  _(PartView)("Part 2", "Content 2");
  _(PartView)("Part 3", "Content 3");
  _(PartView)("Part 4", "Content 4");
});

declare module "refina" {
  interface Plugins {
    Basics: typeof Basics;
  }
}
