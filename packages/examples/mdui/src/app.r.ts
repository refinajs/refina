/// <reference types="vite/client" />
import { app } from "refina";
import "@refina/mdui";
import "@refina/mdui/styles.css";

app((_) => {
  _.provideMDTheme("red", "orange");
  // _.t`Hello, world!`;
  // _._br();
  // _.mdButton("Click me!");
  _.mdButton((_) => {
    _.mdIcon("credit_card");
    _.t`Click me!`;
  });
});
