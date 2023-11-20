/// <reference types="vite/client" />
import MdUI2 from "@refina/mdui2";
import "@refina/mdui2/styles.css";
import { Content, app, bySelf, d, view } from "refina";

const componentView = view((_, name: string, inner: Content) => {
  _._div({}, _ => {
    _.$css`margin-bottom:8px`;
    _._h3({}, name);
    _.embed(inner);
  });
});

let count = 0;
let status = d(false);
const options = ["Option 1", "Option 2", "Option 3"] as const;
let selected = d<(typeof options)[number]>(options[0]);

app.use(MdUI2)(_ => {
  _._h1({}, "MDUI2 Test");

  _._p({}, `Count is ${count}`);
  _._p({}, `Status is ${status.value}`);
  _._p({}, `Selected is ${selected.value}`);

  _.embed(componentView, "Avatar", _ => _.mdAvatar("https://via.placeholder.com/80x80?text=A"));
  _.embed(componentView, "Badge", _ => {
    _.mdBadge();
    _.t` `;
    _.mdBadge("99+");
  });
  _.embed(componentView, "Button", _ => {
    _.mdButton("Button") && count++;
    _.mdButton("Button", true) && count++;
  });
  _.embed(componentView, "Checkbox", _ => {
    _.mdCheckbox(status, "Checkbox");
    _.mdCheckbox(status, "Checkbox", true);
  });
  _.embed(componentView, "Circlular Progress", _ => {
    _.mdCircularProgress();
    _.mdCircularProgress(0.8);
  });
  _.embed(componentView, "Divider", _ => {
    _.mdDivider();
    _.$css`height: 40px; margin-left: 30px`;
    _._div({}, _ => _.mdVerticalDivider());
  });
  _.embed(componentView, "Linear Progress", _ => {
    _.mdLinearProgress();
    _.mdLinearProgress(0.4);
  });
  _.embed(componentView, "List", _ =>
    _.mdList(["Item 1", "Item 2", "Item 3"], bySelf, item => {
      _.t(item);
    }),
  );
  _.embed(componentView, "Radio Group", _ => {
    _.mdRadioGroup(selected, ["Option 1", "Option 2", "Option 3"]);
    _._br();
    _.mdRadioGroup(selected, ["Option 1", "Option 2", "Option 3"], [false, true], {
      "Option 3": _ => _.mdAvatar("https://via.placeholder.com/80x80?text=3"),
    });
    _._br();
    _.mdRadioGroup(selected, ["Option 1", "Option 2", "Option 3"], true);
  });
});
