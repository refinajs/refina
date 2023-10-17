/// <reference types="vite/client" />
import { app } from "refina";
import "@refina/mdui";
import "@refina/mdui/styles.css";
// let visible = false;

app((_) => {
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
});
