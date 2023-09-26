import { app } from "refina";
import "@refina/fluentui";
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
    () => {
      _.rNavLogo("ZVMS");
      if (isNaN(userId.value)) {
        _.rNavItem("person", "Login") && _.$router.goto("/login");
      } else {
        _.rNavItem("dashboard", "Dashboard") && _.$router.goto("/");
        _.rNavItem("person", "Me") && _.$router.goto(`/user/${userId}`);
      }
    },
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
