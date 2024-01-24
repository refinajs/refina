export default (tailwind: boolean) => `/**
 * Refina.js + MdUI
 */

import { $app, model } from "refina";
import MdUI from "@refina/mdui";
import "./styles.css";

let count = 0;
const username = model("Refina");

$app([MdUI], _ => {${tailwind ? `\n  _.$cls\`underline\`;` : ""}
  _._h1({}, \`Hello \${username}!\`);
  _.mdButton(\`Count is: \${count}\`) && count++;
  _.mdTextField(username, "Username");
});

declare module "refina" {
  interface Plugins {
    MdUI: typeof MdUI;
  }
}
`;
