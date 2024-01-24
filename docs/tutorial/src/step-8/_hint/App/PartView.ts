import { $view, Content, _ } from "refina";

export default $view((title: string, content: Content) => {
  _.h1(title);
  _.p(content);
});
