/// <reference types="vite/client" />
import { app, d, getD } from "refina";
import "@refina/mdui";
import "@refina/mdui/styles.css";

import mdui from "../../../mdui/node_modules/mdui";
import MdUI from "@refina/mdui";
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
      _.mdTitle("123", true);
      _.mdSpacer();
      _.mdIconButton("refresh", false);
    });
  });

  _._br();
  _._br();
  _.mdDivider();

  _.mdInput(val, "Label");
  if (val.value === "123") {
    _._p({}, "You 've typed '123'");
  }
  _.mdTitle("123", true);
  _.mdTitle("123");

  _.mdSheet((_) => {
    _.mdTitle("This is title");
    // _._span({}, "Username: ");
    _.mdInput(val, "用户名");
  });

  _.mdList((_) => {
    _.mdListItem("Item 1");
    _.mdListItem("Item 2");
    _.mdListItem("Item 3");
  });

  // let trigger = () => {}
  // _.mdDialog(
  //   "Hello",
  //   (_) => {
  //     _._p("123")
  //   },
  //   (_) => {
  //     _.mdButton("Confirm")
  //     _.mdButton("Reject")
  //   },
  //   (trig) => { trigger = trig }
  // );

  // if (_.mdButton("123")) {
  //   trigger()
  // }

  _.mdDialog(
    "Hello",
    (_) => {
      _._p("123");
    },
    (_) => {
      _.mdButton("Confirm");
      _.mdButton("Reject");
    },
    (trig) => {
      if (_.mdButton("123")) {
        trig();
      }
    },
  );
});
