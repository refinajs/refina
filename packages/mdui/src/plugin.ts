import { AppState, Plugin } from "refina";
import { AccentHue, PrimaryHue } from "./theme";
import { update } from "./update";

const MdUI = new Plugin(
  "mdui",
  (app, primaryHue?: PrimaryHue, accentHue?: AccentHue) => {
    app.addPermanentHook("beforeMain", () => {
      if (primaryHue) {
        app._!.$rootCls(`mdui-theme-primary-${primaryHue}`);
      }

      if (accentHue) {
        app._!.$rootCls(`mdui-theme-accent-${accentHue}`);
      }
    });

    app.addPermanentHook("afterModifyDOM", () => {
      if (app.state === AppState.update) {
        update();
      }
    });
  },
);
export default MdUI;
