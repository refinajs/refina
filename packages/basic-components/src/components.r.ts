import {
  Content,
  D,
  DOMElementComponent,
  KeyFunc,
  OutputComponent,
  OutputComponentContext,
  StatusComponent,
  StatusComponentContext,
  TriggerComponent,
  TriggerComponentContext,
  getD,
  ref,
} from "refina";
import Basics from "./plugin";

@Basics.statusComponent("div")
export class Div extends StatusComponent {
  main(_: StatusComponentContext<this>, inner: D<Content>) {
    _._div({}, inner);
  }
}
declare module "refina" {
  interface StatusComponents {
    div: Div;
  }
}

@Basics.outputComponent("span")
export class Span extends OutputComponent {
  main(_: OutputComponentContext<this>, inner: D<Content>) {
    _._span({}, inner);
  }
}
declare module "refina" {
  interface OutputComponents {
    span: Span;
  }
}

@Basics.outputComponent("br")
export class BreakLine extends OutputComponent {
  main(_: OutputComponentContext<this>) {
    _._br();
  }
}
declare module "refina" {
  interface OutputComponents {
    br: BreakLine;
  }
}

@Basics.outputComponent("h1")
export class Heading1 extends OutputComponent {
  main(_: OutputComponentContext<this>, inner: D<Content>) {
    _._h1({}, inner);
  }
}
declare module "refina" {
  interface OutputComponents {
    h1: Heading1;
  }
}

@Basics.outputComponent("p")
export class Paragraph extends OutputComponent {
  main(_: OutputComponentContext<this>, inner: D<Content>) {
    _._p({}, inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    p: Paragraph;
  }
}

@Basics.outputComponent("a")
export class Anchor extends OutputComponent {
  main(_: OutputComponentContext<this>, href: D<string>, inner: D<Content>) {
    _._a(
      {
        href: getD(href),
      },
      inner,
    );
  }
}
declare module "refina" {
  interface OutputComponents {
    a: Anchor;
  }
}

@Basics.triggerComponent("button")
export class Button extends TriggerComponent<MouseEvent> {
  main(_: TriggerComponentContext<MouseEvent, this>, inner: D<Content>, disabled: D<boolean> = false) {
    _._button(
      {
        onclick: (ev) => {
          _.$fire(ev);
        },
        disabled: getD(disabled),
        type: "button",
      },
      getD(inner),
    );
  }
}
declare module "refina" {
  interface TriggerComponents {
    button: Button;
  }
}

@Basics.outputComponent("textInput")
export class TextInput extends OutputComponent {
  inputEl = ref<DOMElementComponent<"input">>();
  main(_: OutputComponentContext<this>, value: D<string>, disabled?: D<boolean>, placeholder?: D<string>) {
    _.$ref(this.inputEl) &&
      _._input({
        type: "text",
        disabled: getD(disabled),
        placeholder: getD(placeholder),
        value: getD(value),
        oninput: () => {
          _.$setD(value, this.inputEl.current!.node.value);
        },
      });
  }
}
declare module "refina" {
  interface OutputComponents {
    textInput: TextInput;
  }
}

@Basics.statusComponent("passwordInput")
export class PasswordInput extends StatusComponent {
  inputEl = ref<DOMElementComponent<"input">>();
  main(_: StatusComponentContext<this>, value: D<string>) {
    _.$ref(this.inputEl) &&
      _._input({
        type: "password",
        value: getD(value),
        oninput: () => {
          _.$setD(value, this.inputEl.current!.node.value);
        },
        onfocus: _.$on,
        onblur: _.$off,
      });
  }
}
declare module "refina" {
  interface StatusComponents {
    passwordInput: PasswordInput;
  }
}

@Basics.statusComponent("toggleButton")
export class ToggleButton extends StatusComponent {
  main(_: StatusComponentContext<this>, inner: D<Content>) {
    if (_.button(inner)) {
      _.$toggle();
    }
  }
}
declare module "refina" {
  interface StatusComponents {
    toggleButton: ToggleButton;
  }
}

@Basics.statusComponent("checkbox")
export class Checkbox extends StatusComponent {
  inputEl = ref<DOMElementComponent<"input">>();
  main(
    _: StatusComponentContext<this>,
    label: D<string>,
    value: D<boolean> = this.inputEl.current?.node.checked ?? false,
  ) {
    _._label({}, () => {
      _.t(label);
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
declare module "refina" {
  interface StatusComponents {
    checkbox: Checkbox;
  }
}

@Basics.outputComponent("ul")
export class UnorderedList extends OutputComponent {
  main<T>(
    _: OutputComponentContext<this>,
    data: D<Iterable<T>>,
    key: KeyFunc<T>,
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
declare module "refina" {
  interface CustomContext<C> {
    ul: UnorderedList extends C
      ? <T>(
          data: D<Iterable<T>>,
          key: keyof T | ((item: T, index: number) => D<string>),
          body: (item: T, index: number) => void,
        ) => false
      : never;
  }
}

@Basics.outputComponent("li")
export class ListItem extends OutputComponent {
  main(_: OutputComponentContext<this>, inner: D<Content>) {
    _._li({}, inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    li: ListItem;
  }
}

@Basics.outputComponent("img")
export class Image extends OutputComponent {
  main(_: OutputComponentContext<this>, src: D<string>, alt: D<string>): void {
    _._img({
      src: getD(src),
      alt: getD(alt),
    });
  }
}
declare module "refina" {
  interface OutputComponents {
    img: Image;
  }
}
