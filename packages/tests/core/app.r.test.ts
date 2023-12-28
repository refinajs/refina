import { $app } from "refina";
import { initRootElement } from "../utils";

beforeAll(() => {
  initRootElement();
});

describe("simple app", () => {
  it("should render a simple app", async () => {
    const appInstance = $app(_ => {
      _._h1({}, "Hello World!");
      _.$cls`main`;
      _._div({}, _ => {
        _.$css`color: red`;
        _._p({}, "This is a paragraph.");
      });
    });

    await appInstance.promises.DOMUpdated;

    expect(document.body.innerHTML).toMatchSnapshot();
  });
});
