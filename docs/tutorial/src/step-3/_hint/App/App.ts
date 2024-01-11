import { $app } from "refina";
import Basics from "@refina/basic-components";

$app.use(Basics)(_ => {
  _.$cls`my-class`;
  _.$css`color:red;font-size:2rem`;
  _.h1("Make me styled!");
});
