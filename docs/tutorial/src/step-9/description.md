# Low-level Rendering

In the previous steps, we have used components to render our application. However, sometimes you need to render something that is not provided as a component.

Low-level rendering functions give you the full ability to render any DOM element. Also, components are implemented using these low-level rendering functions.

Here is an example:

```ts
let count = 0;

const app = $app([], _ => {
  _.$cls`my-button`; // _.$cls and _.$css are also available
  _._button(
    // Attributes (optional)
    {
      id: "my-div",
      onclick() {
        count++;
        app.update(); // Update the application
      },
    },
    // Content (optional)
    _ => _.span(`Count is ${count}`),
    // Event listeners (optional)
    {
      hover: {
        mousemove(ev) {
          console.log(ev.clientX, ev.clientY);
        },
        capture: true,
      },
    },
  );
});
```

This is much less convenient than using components. When you think you are going to use a low-level rendering function instead of a not-perfect component, please consider whether it is necessary: Is it worth spending time to have that feature? Often minor features can take a lot of time without being very useful.

The name of the low-level rendering functions are like this:

- **HTML**: `_._div` for `<div>`
- **Web components**: `_._custom_element` for `<custom-element>`
- **SVG**: `_._svgCircle` for `<circle>`

Now, let's rewrite the HTML in the comment using low-level rendering functions.
