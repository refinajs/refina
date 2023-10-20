import mdui from "mdui";
import { Plugin } from "refina";
import { UpdateDialogSize, UpdateMDUI, UpdateSelectItems } from "./symbol";
import { Dialog } from "mdui/es/components/dialog/class";

const MdUI = new Plugin("mdui", (app) => {
  app.addPermanentHook("afterModifyDOM", () => {
    if (app.permanentData[UpdateMDUI] === true) {
      mdui.mutation();
      app.permanentData[UpdateMDUI] = false;
    }

    // if (app.permanentData[UpdateSelectItems] === true) {
    //   mdui.handleUpdate();
    //   app.permanentData[UpdateSelectItems] = false;
    // }

    if (app.permanentData[UpdateDialogSize] !== undefined) {
      (app.permanentData[UpdateDialogSize] as Dialog).handleUpdate();
      app.permanentData[UpdateDialogSize] = undefined;
    }
  });
});
export default MdUI;
