export default (tailwind: boolean) => `/**
 * Refina.js + MdUI + Basic-components
 */

import Basics from "@refina/basic-components";
import MdUI from "@refina/mdui";
import "@refina/mdui/styles.css";
import { app, d } from "refina";

let count = 0;
const username = d("Refina");

app.use(Basics).use(MdUI)(_ => {${tailwind ? `\n  _.$cls\`underline\`;` : ""}
  _.h1(\`Hello \${username}!\`);
  _.mdButton(\`Count is: \${count}\`) && count++;
  _.mdTextField(username, "Username");
});
`;
