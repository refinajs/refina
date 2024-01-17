import { $app } from "refina";
import Basics from "@refina/basic-components";

let count = 0;

$app.use(Basics)(_ => {
  // Not here!

  _.p(`Count is ${count}!`);
});
