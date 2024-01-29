import { $app } from "refina";
import Basics from "@refina/basic-components";
import JSConfetti from "js-confetti";
const confetti = new JSConfetti();
confetti.addConfetti();
$app([Basics], _ => {
  _.$css`
    all: unset;
    font-size: xx-large;
    font-weight: bold;
    text-align: center;
    margin: 3em 30%;`;
  _.button("🎉 Congratulations!") && confetti.addConfetti();
});
declare module "refina" {
  interface Plugins {
    Basics: typeof Basics;
  }
}