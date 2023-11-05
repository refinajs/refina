import mdui from "mdui";
import { Dialog } from "mdui/es/components/dialog/class";

let dialogsToBeUpdated: Dialog[] = [];
export function needUpdateDialogSize(dialog: Dialog) {
  dialogsToBeUpdated.push(dialog);
}

let textFieldsToBeUpdated = false;
export function needUpdateTextFields() {
  textFieldsToBeUpdated = true;
}

export function update() {
  mdui.mutation();

  for (const dialog of dialogsToBeUpdated) {
    dialog.handleUpdate();
    dialogsToBeUpdated = [];
  }

  if (textFieldsToBeUpdated) {
    mdui.updateTextFields();
    textFieldsToBeUpdated = false;
  }
}
