# refina

An extremely **refined** web framework.

Using ImGUI, with full TypeScript support.

No DSL or JSX, just plain TypeScript, with a little bit comptime transformation.

Works best with [tailwindcss](https://tailwindcss.com/).

## Example

```typescript
import { d, view } from "refina";
const name = d("");
let times = 0; // needn't be warped in d()
view((_) => {
  _.t`Enter your name:`;
  if (_.textInput(name)) {
    // returns true if the input is focused
    _.t`You're inputting`;
  }
  if (_.button("Click me!", name.length === 0)) {
    // returns true if the button is clicked
    times++;
    console.log(_.$ev); // TypeScript shows _.$ev is MouseEvent
  }
  if (times > 0) {
    // use if to control the rendering
    _.h1(`Hello, ${name} for the ${times}th time!`);
  }
});
```
