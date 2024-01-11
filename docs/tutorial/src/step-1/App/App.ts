import { $app } from "refina";
import Basics from "@refina/basic-components";

$app.use(Basics)(_ => {
  _.h1("Hello, world!");
});
