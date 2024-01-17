import { $app, model } from "refina";
import Basics from "@refina/basic-components";
const name = model("");
$app.use(Basics)(_ => {
  _.textInput(name);
  if (name.value.length > 0) {
    _.button("Clear") && (name.value = "");
  }
  _.p(`Hello ${name}!`);
});