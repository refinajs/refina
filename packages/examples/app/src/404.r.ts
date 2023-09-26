import { view } from "refina";

export default view((_) => {
  _.rCard(`404`, () => {
    _.p(`Page not found: ${location.href}`);
    if (_.rButton(`Go back`)) {
      _.$router.goto("/");
    }
  });
});
