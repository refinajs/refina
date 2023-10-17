import FIcons from "@refina/fluentui-icons";
import { Plugin } from "refina";

const FluentUI = new Plugin("fluentui", (app) => {
  FIcons.install(app);
});
export default FluentUI;
