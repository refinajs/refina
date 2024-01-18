export default (tailwind: boolean) => `/**
 * Refina.js with no component library
 */

import { $app } from "refina";
import "./styles.css";

$app(_ => {${tailwind ? `\n  _.$cls\`text-xl font-bold p-4\`;` : ""}
  _._h1({}, "Hello, Refina!");
  _._p({}, _ => {${
    tailwind ? `\n    _.$cls\`block p-2 hover:bg-gray-200\`;` : ""
  }
    _._a(
      {
        href: "https://github.com/refinajs/refina",
      },
      "Visit Refina on GitHub",
    );${
      tailwind
        ? `\n    _.$cls\`block p-2 hover:bg-gray-200\`;`
        : "\n    _._br();"
    }
    _._a(
      {
        href: "https://refina.vercel.app",
      },
      "Visit Refina's documentation",
    );
  });
});
`;
