import { D, getD, ref } from "../data";
import {
  CallbackComponent,
  CallbackComponentContext,
  StatusComponent,
  StatusComponentContext,
  TriggerComponent,
  TriggerComponentContext,
  callbackComponent,
  statusComponent,
  triggerComponent,
} from "./index";
import { HTMLElementComponent } from "../dom";
import { ViewRender } from "../view";
import {
  OutputComponent,
  OutputComponentContext,
  outputComponent,
} from "./output";

@statusComponent
export class Div extends StatusComponent {
  main(
    _: StatusComponentContext<this>,
    inner: D<string | number | ViewRender>,
  ) {
    _._div({}, inner);
  }
}
declare module "./index" {
  interface StatusComponents {
    div: Div;
  }
}

@outputComponent
export class Span extends OutputComponent {
  main(
    _: OutputComponentContext<this>,
    inner: D<string | number | ViewRender>,
  ) {
    _._span({}, inner);
  }
}
declare module "./index" {
  interface OutputComponents {
    span: Span;
  }
}

@outputComponent
export class Br extends OutputComponent {
  main(_: OutputComponentContext<this>) {
    _._br();
  }
}
declare module "./index" {
  interface OutputComponents {
    br: Br;
  }
}

@outputComponent
export class H1 extends OutputComponent {
  main(
    _: OutputComponentContext<this>,
    inner: D<string | number | ViewRender>,
  ) {
    _._h1({}, inner);
  }
}
declare module "./index" {
  interface OutputComponents {
    h1: H1;
  }
}

@outputComponent
export class P extends OutputComponent {
  main(
    _: OutputComponentContext<this>,
    inner: D<string | number | ViewRender>,
  ) {
    _._p({}, inner);
  }
}

declare module "./index" {
  interface OutputComponents {
    p: P;
  }
}

@triggerComponent
export class Button extends TriggerComponent {
  main(_: TriggerComponentContext<MouseEvent, this>, text: D<string>) {
    _._button(
      {
        onclick: _.$fire,
      },
      getD(text),
    );
  }
}
declare module "./index" {
  interface TriggerComponents {
    button: Button;
  }
}

@statusComponent
export class TextInput extends StatusComponent {
  inputEl = ref<HTMLElementComponent<"input">>();
  main(_: StatusComponentContext<this>, label: D<string>, value: D<string>) {
    _.$component;
    _._label({}, () => {
      _._t(label);
      _.$ref(this.inputEl) &&
        _._input({
          type: "text",
          value: getD(value),
          oninput: () => {
            _.$setD(value, this.inputEl.current!.node.value);
          },
          onfocus: _.$on,
          onblur: _.$off,
        });
    });
  }
}
declare module "./index" {
  interface StatusComponents {
    textInput: TextInput;
  }
}

@statusComponent
export class ToggleButton extends StatusComponent {
  main(_: StatusComponentContext<this>, text: D<string>) {
    if (_.button(text)) {
      _.$toggle();
    }
  }
}
declare module "./index" {
  interface StatusComponents {
    toggleButton: ToggleButton;
  }
}

@statusComponent
export class Checkbox extends StatusComponent {
  inputEl = ref<HTMLElementComponent<"input">>();
  main(
    _: StatusComponentContext<this>,
    label: D<string>,
    value: D<boolean> = this.inputEl.current?.node.checked ?? false,
  ) {
    _._label({}, () => {
      _._t(label);
      _.$ref(this.inputEl) &&
        _._input({
          type: "checkbox",
          onchange: () => {
            _.$setD(value, this.inputEl.current!.node.checked);
            _.$status = this.inputEl.current!.node.checked;
          },
        });
    });
  }
}
declare module "./index" {
  interface StatusComponents {
    checkbox: Checkbox;
  }
}

@outputComponent
export class Ul extends OutputComponent {
  main<T>(
    _: OutputComponentContext<this, any>,
    data: D<Iterable<T>>,
    key: keyof T | ((item: T, index: number) => D<string>),
    body: (item: T, index: number) => void,
  ): void {
    _._ul({}, () => {
      _.for(data, key, (item, index) => {
        _._li({}, () => {
          body(item, index);
        });
      });
    });
  }
}
declare module "./index" {
  interface OutputComponents {
    ul: Ul;
  }
}
