import { defineRender } from "../../lib";
import "../../components";

export default defineRender((_) => {
  _.rLeftNav(
    () => {
      _.div(() => {
        _.$cls`text-2xl font-bold text-center`;
        _.span("ZVMS");

        _.button("home");
      });
    },
    () => {
      _.rRouterView();
    },
  );
});
