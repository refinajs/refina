export default (tailwind: boolean) => `/**
 * Refina.js + MdUI + Basic-components
 */

import { $app, model } from "refina";
import Basics from "@refina/basic-components";
import MdUI from "@refina/mdui";
import "./styles.css";

let count = 0;
const username = model("Refina");

$app([Basics, MdUI], _ => {${tailwind ? `\n  _.$cls\`underline\`;` : ""}
  _.h1(\`Hello \${username}!\`);
  _.mdButton(\`Count is: \${count}\`) && count++;
  _.mdTextField(username, "Username");
});

declare module "refina" {
  interface Plugins {
    Basics: typeof Basics;
    MdUI: typeof MdUI;
  }
}
`;
