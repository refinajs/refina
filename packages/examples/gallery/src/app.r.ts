import Basics from "@refina/basic-components";
import { app } from "refina";

window.addEventListener("popstate", () => {
  window.location.reload();
});
let loading = false;

const examples = [
  {
    id: "fluentui",
    name: "Fluent UI",
    detail: "The impl in Refina for @fluentui/react. Package: @refina/fluentui.",
  },
  {
    id: "mdui2",
    name: "MdUI v2",
    detail: "The adaptation of MdUI to Refina. Package: @refina/mdui2.",
  },
  {
    id: "gh-login",
    name: "GitHub Login",
    detail: "A fake GitHub login page using @refina/basic-components and TailwindCSS.",
  },
] as const;

type ExampleId = (typeof examples)[number]["id"];

function isExample(id: ExampleId) {
  return location.hash === `#${id}`;
}

function removeTailwind() {
  document.getElementById("tailwind-styles")?.remove();
}

if (isExample("fluentui")) {
  removeTailwind();
  import("@refina/example-fluentui");
} else if (isExample("mdui2")) {
  removeTailwind();
  import("@refina/example-mdui2");
} else if (isExample("gh-login")) {
  import("@refina/example-gh-login");
} else {
  app.use(Basics)(_ => {
    _.$rootCls`p-4`;

    if (loading) return;

    _.$cls`font-bold text-3xl`;
    _.h1("Refina example gallery");
    if (location.hash === "" || location.hash === "#") {
      _.for(examples, "id", example => {
        _.$cls`block border-2 rounded-lg border-gray-600 my-4 p-2 hover:bg-gray-200 w-full`;
        if (
          _.button(_ => {
            _.$cls`float-left`;
            _.span(example.name);
            _.$cls`float-right text-gray-600 pr-10`;
            _.span(example.detail);
          })
        ) {
          loading = true;
          window.history.pushState(null, "", `${location.protocol}//${location.host}#${example.id}`);
          window.location.reload();
        }
      });
    } else {
      _.p(`Example ${location.hash} not found.`);
    }

    _.$cls`text-gray-600`;
    _.p(`Use back button to return to the gallery.`);
  });
}
