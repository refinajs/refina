import mdui from "mdui";
import { Plugin } from "refina";
import { UpdateMDUI, UpdateSelectItems } from "./symbol";

const MdUI = new Plugin("mdui", (app) => {
  app.addPermanentHook("afterModifyDOM", () => {
    if (app.permanentData[UpdateMDUI] === true) {
      mdui.mutation();
      app.permanentData[UpdateMDUI] = false;
    }

    if (app.permanentData[UpdateSelectItems] === true) {
      mdui.handleUpdate();
      app.permanentData[UpdateSelectItems] = false;
    }
  });
});
export default MdUI;
