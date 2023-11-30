import { AppStateType, Plugin } from "refina";
import { AccentHue, PrimaryHue } from "./theme";
import { update } from "./update";

const MdUI = new Plugin(
  "mdui",
  (app, primaryHue?: PrimaryHue, accentHue?: AccentHue) => {
    app.pushPermanentHook("beforeMain", () => {
      if (primaryHue) {
        app.root.addCls(`mdui-theme-primary-${primaryHue}`);
      }

      if (accentHue) {
        app.root.addCls(`mdui-theme-accent-${accentHue}`);
      }
    });

    app.pushPermanentHook("afterModifyDOM", () => {
      if (app.state.type === AppStateType.UPDATE) {
        update();
      }
    });
  },
);
export default MdUI;
