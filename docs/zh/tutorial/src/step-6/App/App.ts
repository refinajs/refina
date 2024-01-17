import { $app } from "refina";
import Basics from "@refina/basic-components";

let name = "";

$app.use(Basics)(_ => {
  if (_.textInput(name)) {
    name = _.$ev;
  }
  _.p(`Hello ${name}!`);
});
