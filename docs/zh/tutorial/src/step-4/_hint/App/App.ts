import { $app } from "refina";
import Basics from "@refina/basic-components";

let count = 0;

$app.use(Basics)(_ => {
  // 不是在这里定义状态！

  _.p(`Count is ${count}!`);
});
