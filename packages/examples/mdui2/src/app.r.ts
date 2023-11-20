/// <reference types="vite/client" />
import MdUI2 from "@refina/mdui2";
import "@refina/mdui2/styles.css";
import { Content, app, view } from "refina";

const componentView = view((_, name: string, inner: Content) => {
  _._div({}, _ => {
    _.$css`margin-bottom:8px`;
    _._h3({}, name);
    _.embed(inner);
  });
});

app.use(MdUI2)(_ => {
  _._h1({}, "MDUI2 Test");
});
