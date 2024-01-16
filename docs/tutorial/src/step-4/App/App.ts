import { $app } from "refina";
import Basics from "@refina/basic-components";

// Should declare states here?

$app.use(Basics)(_ => {
  // Or here?

  _.p("Count is 0!");
});
