import { d, ref, view } from "./lib";
import "./components/index";
import { RForm, formData } from "./components/index";

const stacked = d(false);
let n = 1;
let open = d(true);
const form = formData<{
  name: string;
  name1: string;
  checked: boolean;
}>();

view((_) => {
  _.rCard("Heading", () => {
    if (form.name?.length > 2) _.h1(form.name);
    if (
      _.rForm(
        form,
        (_) => {
          _.rTextField("name", "Name", (s) => s.length >= 5 || "Must be at least 5 chars");
          _.rTextField("name1", "Name", (s) => s.length >= 5 || "Must be at least 5 chars");
          _.rCheckbox("checked", "Check it");
        },
        "Submit",
      )
    ) {
      alert(JSON.stringify(form) + "\n" + JSON.stringify(_.$ev));
    }
    _.h1(form.name1);
  });

  // //   _.rPrependIcon("A", stacked);
  if (_.rButton("Text")) {
    n++;
    open.value = true;
    _.$ev;
  }

  // _.rDialog(open, () => {
  //   if (_.rCard("Heading", "Body", ["OK", "Cancel"], [false, true])) {
  //     n = _.$ev;
  //   }
  // });
});
