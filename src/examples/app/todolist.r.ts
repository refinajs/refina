import { view } from "../../lib";
export default view((_) => {
  _.rCard(`Todo List`, () => {
    if (_._cbButton({}, "111")) {
      _.$.onAbort();
    }
  });
});
