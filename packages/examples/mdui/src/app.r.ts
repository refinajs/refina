/// <reference types="vite/client" />
import MdUI, { mdui } from "@refina/mdui";
import "@refina/mdui/styles.css";
import { app, d } from "refina";

// let visible = false;
let val = d("string");

app.use(MdUI)((_) => {
  _._h1({}, "Test MDUI!");

  _.provideMDTheme("indigo", "red");

  _.mdButton("Normal Button");
  _.mdButton((_) => {
    _.mdIcon("credit_card");
    _.t`Button with Icon`;
  });
  _.mdButton("Disabled Button", true);
  _.mdIconButton("devices");
  _.mdAppbar("toolbar", (_) => {
    _.mdToolbar((_) => {
      _.mdIconButton("menu", false);
      _.mdSpacer();
      _.mdIconButton("refresh", false);
    });
  });
  _._br();
  _._br();

  _.mdInput(val, "Label");
  if (val.value === "123") {
    _._p({}, "You 've typed '123'");
  }
});

setInterval(() => {
  mdui.mutation();
}, 1000);
