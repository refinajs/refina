import mdui from "mdui";
import { Dialog } from "mdui/es/components/dialog/class";
import { AppState, Plugin } from "refina";
import { updateDialogSizeSym, updateTextFieldsSym } from "./symbol";

const MdUI = new Plugin("mdui", (app) => {
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
});
export default MdUI;
