import { $view } from "refina";

export default $view((_, title, content) => {
  _.h1(title);
  _.p(content);
});
