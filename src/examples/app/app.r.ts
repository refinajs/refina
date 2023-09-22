import { app } from "../../lib";
import "../../components";
import "../../router";
import { userId } from "./store";

app((_) => {
  if (_.beforeRoute()) {
    if (isNaN(userId.value)) {
      _.$routeNext("/login");
    } else {
      _.$routeNext();
    }
  }
  _.rLeftNav(
    () =>
      _.div(() => {
        _.$cls`text-2xl font-bold text-center block`;
        _.div("ZVMS");
        if (isNaN(userId.value)) {
          _.$cls`block`;
          _.button("Login") && _.$router.goto("/login");
        } else {
          _.$cls`block`;
          _.button("Dashboard") && _.$router.goto("/");
          _.$cls`block`;
          _.button("Me") && _.$router.goto(`/user/${userId}`);
        }
      }),
    () =>
      _.$cls`p-10` &&
      _.div(() => {
        _.route("/") && _.embed(() => import("./dashboard.r"));
        _.route("/login") && _.embed(() => import("./login.r"));
        _.route("/user/:id") && _.embed(() => import("./user.r"), _.$route.$number.id);
        _.routeNotFound() && _.embed(() => import("./404.r"));
      }),
  );
});
