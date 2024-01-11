import { $app } from "refina";
import Basics from "@refina/basic-components";

$app.use(Basics)(_ => {
  _.h1(`You have clicked the button 0 times.`);
  _.button("Click me!");
});
