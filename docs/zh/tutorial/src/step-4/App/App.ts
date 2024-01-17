import { $app } from "refina";
import Basics from "@refina/basic-components";

// 在这里定义状态？

$app.use(Basics)(_ => {
  // 还是这里？

  _.p("Count is 0!");
});
