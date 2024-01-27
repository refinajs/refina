# 底层渲染

在之前的步骤中，我们使用组件来渲染页面。 但是，有时你想要渲染的东西并没有对应的组件。

底层渲染函数允许你渲染任何的 DOM 元素。 以及，组件归根结底也是通过这些底层渲染函数实现的。

下面是一个示例：

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

这比使用组件要不那么方便。 当你觉得需要使用底层渲染函数，而不是使用组件是，请考虑这是否是必须的：底层渲染函数提供的额外功能真的值得花时间事先吗？ 往往一些细枝末节且特别的功能会耗费开发者大量的时间，却并没有成比例的用处。

底层渲染函数的名字遵循这样的规律：

- **HTML**: `_._div` 是 `<div>`
- **Web components**: `_._custom_element` 是 `<custom-element>`
- **SVG**: `_._svgCircle` 是 `<circle>`

现在，试着将注释中的 HTML 代码通过底层渲染函数重写。
