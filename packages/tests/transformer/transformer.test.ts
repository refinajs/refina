// @refina-ignore

import {
  RefinaTransformer,
  MagicString,
  searchCtxFuncCalls,
} from "@refina/transformer";

describe("transformer", () => {
  it("should transform new file correctly", () => {
    const transformer = new RefinaTransformer();
    const source = `
      _.div(1, _ => {
        _.div(2, _ => {
          _.div(3);
        });
      });
      _.t\`123\`;
      _.t(123);
      _(comp)(1, _ => {})
      _.$cls\`abc\`;
    `;
    const s = new MagicString(source);
    const lastIndex = transformer.transformNewFile(
      s,
      searchCtxFuncCalls(source),
      "~",
    );

    expect(s.toString()).toMatchSnapshot();
    expect(lastIndex).toBe(6);
  });

  it("should return null if nothing is transformed", () => {
    const transformer = new RefinaTransformer();
    const source = `
      123456
    `;
    expect(transformer.transformFile("~", source, false)).toBeNull();
  });

  it("should update transformed file correctly (same)", () => {
    const transformer = new RefinaTransformer();
    const before = `
      _.div(1);
      _.div(2);
    `;
    const after = `
      _.div(1);
      _.div(3);
    `;

    expect(
      transformer.transformFile("~", before, false)?.code,
    ).toMatchSnapshot();
    expect(
      transformer.transformFile("~", after, false)?.code,
    ).toMatchSnapshot();
  });

  it("should update transformed file correctly (append)", () => {
    const transformer = new RefinaTransformer();
    const before = `
      _.div(1);
      _.div(2);
    `;
    const after = `
      _.div(1);
      _.div(2);
      _.div(3);
    `;

    expect(
      transformer.transformFile("~", before, false)?.code,
    ).toMatchSnapshot();
    expect(
      transformer.transformFile("~", after, false)?.code,
    ).toMatchSnapshot();
  });

  it("should update transformed file correctly (insert)", () => {
    const transformer = new RefinaTransformer();
    const before = `
      _.div(1);
      _.span(2);
      _.t\`123\`;
    `;
    const after = `
      _.div(1);
      _.div(2);
      _.span(3);
      _.t\`123\`;
    `;

    expect(
      transformer.transformFile("~", before, false)?.code,
    ).toMatchSnapshot();
    expect(
      transformer.transformFile("~", after, false)?.code,
    ).toMatchSnapshot();
  });

  it("should update transformed file correctly (modify)", () => {
    const transformer = new RefinaTransformer();
    const before = `
      _.div(1);
      _.span(2);
      _.a(2);
    `;
    const after = `
      _.div(1);
      _.div(2);
      _.a(2);
    `;

    expect(
      transformer.transformFile("~", before, false)?.code,
    ).toMatchSnapshot();
    expect(
      transformer.transformFile("~", after, false)?.code,
    ).toMatchSnapshot();
  });

  it("should update transformed file correctly (modify last)", () => {
    const transformer = new RefinaTransformer();
    const before = `
      _.div(1);
      _.span(2);
    `;
    const after = `
      _.div(1);
      _.a(2);
    `;

    expect(
      transformer.transformFile("~", before, false)?.code,
    ).toMatchSnapshot();
    expect(
      transformer.transformFile("~", after, false)?.code,
    ).toMatchSnapshot();
  });

  it("should update transformed file correctly (swap)", () => {
    const transformer = new RefinaTransformer();
    const before = `
      _.div(1);
      _.span(2);
      _.a(2);
      _.div(5);
    `;
    const after = `
      _.div(1);
      _.a(2);
      _.span(2);
      _.div(5);
    `;

    expect(
      transformer.transformFile("~", before, false)?.code,
    ).toMatchSnapshot();
    expect(
      transformer.transformFile("~", after, false)?.code,
    ).toMatchSnapshot();
  });
});
