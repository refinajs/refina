import { d, view } from "../../lib";

const dialog = d(false);

export default view((_, id: number) => {
  _.rCard(`User ${id}`, () => {
    if (_.rButton(`delete`)) {
      dialog.value = true;
    }
    _.rDialog(dialog, "Confirm", `Are you sure to delete user ${id}?`, "Cancel", ["Delete"]) &&
      _.$ev === 0 &&
      _.$.close() &&
      alert(`User ${id} deleted!`);
  });
});
