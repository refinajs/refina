// @refina-ignore

import { transformFragment } from "@refina/transformer";

const testTransform = (source: string, expected: string | undefined) => {
  expect(transformFragment(source, () => "~")?.replaceAll(/\s/g, "")).toBe(
    expected?.replaceAll(/\s/g, ""),
  );
};

describe("transform fragment", () => {
  it("should transform text node tag function", async () => {
    testTransform("_.t`Hello World!`;", '_.$$t("~", `Hello World!`);');
  });

  it("should transform text node component", async () => {
    testTransform(`_.t(abc)`, `_.$$t("~", abc)`);
  });

  it("should transform component", async () => {
    testTransform(`_.div(abc)`, `_.$$c("~", "div", abc)`);
    testTransform(`_ . div ( abc + (def))`, `_.$$c("~", "div", abc + (def))`);
    testTransform(
      `_._div({}, _ => {
        _._div(abc);
      })`,
      `_.$$c("~", "_div", {}, _ => {
        _.$$c("~", "_div", abc);
      })`,
    );
  });

  it("should transform direct call", async () => {
    testTransform(`_(comp)`, `_.$$d("~", comp)`);
    testTransform(`_("$cls")(abc)`, `_.$$d("~", "$cls")(abc)`);
    testTransform(`_(comps[(1)])`, `_.$$d("~", comps[(1)])`);
    testTransform(`_ ( comps[(1)] )`, `_.$$d("~", comps[(1)])`);
  });

  it("should not transform directives", async () => {
    testTransform("_.$cls`abc`", undefined);
    testTransform("_.$cls(abc)", undefined);
  });

  it("should not transform uncalled components", async () => {
    testTransform("_.t", undefined);
    testTransform("_.div", undefined);
    testTransform("_._div", undefined);
  });

  it("should not transform direct call without argument", async () => {
    testTransform("_ ()", undefined);
  });

  it("should not transform function declaration", async () => {
    testTransform("_(a) {", undefined);
  });
});
