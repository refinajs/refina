import {
  ComponentContext,
  Content,
  D,
  DOMElementComponent,
  KeyFunc,
  OutputComponent,
  StatusComponent,
  ToggleComponent,
  TriggerComponent,
  getD,
  ref,
} from "refina";
import Basics from "./plugin";

@Basics.outputComponent("div")
export class BasicDiv extends OutputComponent {
  main(_: ComponentContext, inner: D<Content>) {
    _._div({}, inner);
  }
}
declare module "refina" {
  interface OutputComponents {
    div: BasicDiv;
  }
}

@Basics.outputComponent("span")
export class BasicSpan extends OutputComponent {
  main(_: ComponentContext, inner: D<Content>) {
    _._span({}, inner);
  }
}
declare module "refina" {
  interface OutputComponents {
    span: BasicSpan;
  }
}

@Basics.outputComponent("br")
export class BasicBr extends OutputComponent {
  main(_: ComponentContext) {
    _._br();
  }
}
declare module "refina" {
  interface OutputComponents {
    br: BasicBr;
  }
}

@Basics.outputComponent("h1")
export class BasicH1 extends OutputComponent {
  main(_: ComponentContext, inner: D<Content>) {
    _._h1({}, inner);
  }
}
declare module "refina" {
  interface OutputComponents {
    h1: BasicH1;
  }
}

@Basics.outputComponent("h3")
export class BasicH3 extends OutputComponent {
  main(_: ComponentContext, inner: D<Content>) {
    _._h3({}, inner);
  }
}
declare module "refina" {
  interface OutputComponents {
    h3: BasicH3;
  }
}

@Basics.outputComponent("h4")
export class BasicH4 extends OutputComponent {
  main(_: ComponentContext, inner: D<Content>) {
    _._h4({}, inner);
  }
}
declare module "refina" {
  interface OutputComponents {
    h4: BasicH4;
  }
}

@Basics.outputComponent("h5")
export class BasicH5 extends OutputComponent {
  main(_: ComponentContext, inner: D<Content>) {
    _._h5({}, inner);
  }
}
declare module "refina" {
  interface OutputComponents {
    h5: BasicH5;
  }
}

@Basics.outputComponent("h6")
export class BasicH6 extends OutputComponent {
  main(_: ComponentContext, inner: D<Content>) {
    _._h6({}, inner);
  }
}
declare module "refina" {
  interface OutputComponents {
    h6: BasicH6;
  }
}

@Basics.outputComponent("p")
export class BasicP extends OutputComponent {
  main(_: ComponentContext, inner: D<Content>) {
    _._p({}, inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    p: BasicP;
  }
}

@Basics.outputComponent("a")
export class BaiscA extends OutputComponent {
  main(_: ComponentContext, href: D<string>, inner: D<Content>) {
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
    a: BaiscA;
  }
}

@Basics.triggerComponent("button")
export class BasicButton extends TriggerComponent<MouseEvent> {
  main(_: ComponentContext, inner: D<Content>, disabled: D<boolean> = false) {
    _._button(
      {
        onclick: ev => {
          this.$fire(ev);
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
    button: BasicButton;
  }
}

@Basics.outputComponent("textInput")
export class BasicTextInput extends OutputComponent {
  inputRef = ref<DOMElementComponent<"input">>();
  main(
    _: ComponentContext,
    value: D<string>,
    disabled?: D<boolean>,
    placeholder?: D<string>,
  ) {
    _.$ref(this.inputRef) &&
      _._input({
        type: "text",
        disabled: getD(disabled),
        placeholder: getD(placeholder),
        value: getD(value),
        oninput: () => {
          _.$setD(value, this.inputRef.current!.node.value);
        },
      });
  }
}
declare module "refina" {
  interface OutputComponents {
    textInput: BasicTextInput;
  }
}

@Basics.triggerComponent("passwordInput")
export class BasicPasswordInput extends TriggerComponent<string> {
  inputRef = ref<DOMElementComponent<"input">>();
  main(_: ComponentContext, value: D<string>) {
    _.$ref(this.inputRef) &&
      _._input({
        type: "password",
        value: getD(value),
        oninput: () => {
          const newValue = this.inputRef.current!.node.value;
          _.$setD(value, newValue);
          this.$fire(newValue);
        },
      });
  }
}
declare module "refina" {
  interface TriggerComponents {
    passwordInput: BasicPasswordInput;
  }
}

@Basics.statusComponent("toggleButton")
export class BasicToggleButton extends ToggleComponent {
  main(_: ComponentContext, inner: D<Content>) {
    if (_.button(inner)) {
      this.$toggle();
    }
  }
}
declare module "refina" {
  interface StatusComponents {
    toggleButton: BasicToggleButton;
  }
}

@Basics.triggerComponent("checkbox")
export class BasicCheckbox extends TriggerComponent<boolean> {
  inputRef = ref<DOMElementComponent<"input">>();
  main(
    _: ComponentContext,
    label: D<string>,
    value: D<boolean> = this.inputRef.current?.node.checked ?? false,
  ) {
    _._label({}, _ => {
      _.t(label);
      _.$ref(this.inputRef) &&
        _._input({
          type: "checkbox",
          onchange: () => {
            const newValue = this.inputRef.current!.node.checked;
            _.$setD(value, newValue);
            this.$fire(newValue);
          },
        });
    });
  }
}
declare module "refina" {
  interface TriggerComponents {
    checkbox: BasicCheckbox;
  }
}

@Basics.outputComponent("ul")
export class BasicUl extends OutputComponent {
  main<T>(
    _: ComponentContext,
    data: D<Iterable<T>>,
    key: KeyFunc<T>,
    body: (item: T, index: number) => void,
  ): void {
    _._ul({}, _ => {
      _.for(data, key, (item, index) => {
        _._li({}, _ => {
          body(item, index);
        });
      });
    });
  }
}
declare module "refina" {
  interface ContextFuncs<C> {
    ul: BasicUl extends C["enabled"]
      ? <T>(
          data: D<Iterable<T>>,
          key: KeyFunc<T>,
          body: (item: T, index: number) => void,
        ) => void
      : never;
  }
}

@Basics.outputComponent("img")
export class BasicImg extends OutputComponent {
  main(_: ComponentContext, src: D<string>, alt: D<string> = ""): void {
    _._img({
      src: getD(src),
      alt: getD(alt),
    });
  }
}
declare module "refina" {
  interface OutputComponents {
    img: BasicImg;
  }
}
