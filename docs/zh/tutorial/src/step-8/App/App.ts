import { $app } from "refina";
import Basics from "@refina/basic-components";
$app.use(Basics)(_ => {
  _.h1("Title");
  _.div(_ => {
    _.h2("Part 1");
    _.p("Content 1");
    _.a("share", "#");
  });
  _.div(_ => {
    _.h2("Part 2");
    _.p("Content 2");
    _.a("share", "#");
  });
  _.div(_ => {
    _.h2("Part 3");
    _.p("Content 3");
    _.a("share", "#");
  });
  _.div(_ => {
    _.h2("Part 4");
    _.p("Content 4");
    _.a("share", "#");
  });
});