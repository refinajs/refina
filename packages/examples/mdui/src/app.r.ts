/// <reference types="vite/client" />
import "@refina/mdui";
import "@refina/mdui/styles.css";
import { app, d } from "refina";

import MdUI from "@refina/mdui";
// let visible = false;
let val = d("string");

let v = d("123");

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
    _.mdListItem("Item 1") && console.log("123");
    _.mdListItem("Item 2");
    _.mdListItem("Item 3");
  });

  _.mdDialog(
    (_, open) => _.mdButton("123") && open(),
    "Hello",
    (_) => _._p("123"),
    (_, close) => {
      if (_.mdButton("Confirm")) {
        close();
        console.log("123123");
      }
      _.mdButton("Reject") && close();
    },
  );

  _.mdTable(
    (_) => {
      _._th({}, "title");
      _._th({}, "desc");
      _._th({}, "comment");
    },
    (_) => {
      _._tr({}, (_) => {
        _._td({}, "123");
        _._td({}, "123");
        _._td({}, "123");
      });
      _._tr({}, (_) => {
        _._td({}, "456");
        _._td({}, "456");
        _._td({}, "567");
      });
    },
  );

  if (_.mdInput(v, "input: ")) {
    console.log("123");
  }
});
