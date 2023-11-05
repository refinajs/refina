import mdui from "mdui";
import { Dialog } from "mdui/es/components/dialog/class";
import { AppState, Plugin } from "refina";
import { updateDialogSizeSym, updateTextFieldsSym } from "./symbol";
import { AccentHue, PrimaryHue } from "./theme";

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
        mdui.mutation();

        if (app.runtimeData![updateDialogSizeSym]) {
          (app.runtimeData![updateDialogSizeSym] as Dialog).handleUpdate();
        }

        if (app.runtimeData![updateTextFieldsSym]) {
          mdui.updateTextFields();
        }
      }
    });
  },
);
export default MdUI;
