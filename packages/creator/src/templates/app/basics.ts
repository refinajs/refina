export default (tailwind: boolean) => `/**
 * Refina.js + Basic-components
 */

import { app } from "refina";
import Basics from "@refina/basic-components";

app.use(Basics)(_ => {${tailwind ? `\n  _.$cls\`text-xl font-bold p-4\`;` : ""}
  _.h1("Hello, Refina!");
  _.p(_ => {${tailwind ? `\n    _.$cls\`block p-2 hover:bg-gray-200\`;` : ""}
    _.a("https://github.com/refinajs/refina", "Visit Refina on GitHub");${
      tailwind
        ? `\n    _.$cls\`block p-2 hover:bg-gray-200\`;`
        : "\n    _._br();"
    }
    _.a("https://refina.vercel.app", "Visit Refina's documentation");
  });
});
`;
