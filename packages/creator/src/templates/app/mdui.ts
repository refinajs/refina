export default (tailwind: boolean) => `/**
 * Refina.js + MdUI
 */

import MdUI from "@refina/mdui";
import "@refina/mdui/styles.css";
import { app, d } from "refina";

let count = 0;
const username = d("Refina");

app.use(MdUI)(_ => {${tailwind ? `\n  _.$cls\`underline\`;` : ""}
  _._h1({}, \`Hello \${username}!\`);
  _.mdButton(\`Count is: \${count}\`) && count++;
  _.mdTextField(username, "Username");
});
`;
