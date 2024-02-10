# 视图

视图是一个函数，它渲染一部分页面。

他被用来将页面分割为相对独立的几个部分，并且可以复用。

使用 `$view` 函数来定义视图：

```ts
import { $view, _ } from "refina";

export default $view((id: number) => {
  _.h1(`Card ${id}`);
});
```

调用上下文对象以使用视图：

```ts
import { $app } from "refina";
import CardView from "./CardView";

$app([], _ => {
  _(CardView)("1");
  _(CardView)("2");
  _(CardView)("3");
});
```

现在，试着将编辑器中重复的代码提炼为一个视图，并使用该视图来渲染页面。
