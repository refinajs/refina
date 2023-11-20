/// <reference types="vite/client" />
import MdUI2 from "@refina/mdui2";
import "@refina/mdui2/styles.css";
import { Content, app, d, view } from "refina";

const componentView = view((_, name: string, inner: Content) => {
  _._div({}, _ => {
    _.$css`margin-bottom:8px`;
    _._h3({}, name);
    _.embed(inner);
  });
});

let count = 0;
let status = d(false);

app.use(MdUI2)(_ => {
  _._h1({}, "MDUI2 Test");

  _._p({}, `Count is ${count}`);
  _._p({}, `Status is ${status.value}`);

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
});
