/// <reference types="vite/client" />
import { app } from "refina";
import "@refina/mdui";
import "@refina/mdui/styles.css";

app((_) => {
  _.t`Hello, world!`;
  _._br();
  _.mdButton("Click me!");
});
