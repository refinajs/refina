import elementData from "mdui/html-data.zh-cn.json";
import { Plugin } from "refina";

const MdUI2 = new Plugin("mdui2", (app) => {
  for (const tag of elementData.tags) {
    const tagName = tag.name;
    app.htmlElementAlias[tagName.replaceAll("-", "_")] = tagName;
  }
});
export default MdUI2;
