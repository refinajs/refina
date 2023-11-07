/// <reference types="vite/client" />
import "@refina/mdui";
import "@refina/mdui/styles.css";
import { app, byIndex, byProp, d } from "refina";

import MdUI from "@refina/mdui";
// let visible = false;
let val = d("string");

let v = d("123");

app.use(
  MdUI,
  "indigo",
  "red",
)(_ => {
  _._h1({}, "Test MDUI!");

  _.mdButton("Normal Button");
  _.mdButton(_ => {
    _.mdIcon("credit_card");
    _.t`Button with Icon`;
  });
  _.mdButton("Disabled Button", true);
  _.mdIconButton("devices");
  _.mdAppbar("toolbar", _ => {
    _.mdToolbar(_ => {
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

  _.mdSheet(_ => {
    _.mdTitle("This is title");
    // _._span({}, "Username: ");
    _.mdInput(val, "用户名");
  });

  _.mdList(["Item1", "Item2", "Item3"], byIndex, item => {
    _._p({}, item);
  });

  _.mdDialog(
    (_, open) => _.mdButton("123") && open(),
    "Hello",
    _ => _._p("123"),
    (_, close) => {
      if (_.mdButton("Confirm")) {
        close();
        console.log("123123");
      }
      _.mdButton("Reject") && close();
    },
  );

  _.mdTable(
    [
      { title: "Item1", desc: "123", comment: "Hello" },
      { title: "Item2", desc: "456", comment: "Hi" },
    ],
    ["title", "description", "comment"],
    byProp("title"),
    v => {
      _.mdTableCell(v.title);
      _.mdTableCell(v.desc);
      _.mdTableCell(v.comment);
    },
  );

  if (_.mdInput(v, "input: ")) {
    console.log("123");
  }
});
