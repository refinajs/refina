# refina

An extremely refined web framework.

using ImGUI, with full TypeScript support.

```typescript
import { d, view } from "refina";
const name = d("");
const times = 0;
view((_) => {
  _._t("Enter your name:");
  if (_.textInput(name)) {
    _._t("You're inputting");
  }
  if (_.button("Click me!", name.length === 0)) {
    times++;
  }
  if (times > 0) _.h1(`Hello, ${name} for the ${times}th time!`);
});
```
