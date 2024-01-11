import { $app } from "refina";
import Basics from "@refina/basic-components";

let message = "Hello, world!";
let count = 0;

$app.use(Basics)(_ => {
  _.h1(message);
  _.p(`Count is ${count}!`);
});
