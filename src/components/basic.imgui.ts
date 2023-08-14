import { D, getD, ref } from "../data";
import {
  defineStatus,
  defineTrigger
} from "../component";

// export class RootElement extends ComponentWithChildren {
//   elId: string;
//   createDOM() {
//     const el = document.getElementById(this.elId);
//     if (!el) throw new Error(`Root element not found with id ${this.elId}`);
//     this.el = el;
//   }
//   updateDOM() {
//     this.updateChildrenDOM();
//   }
// }

// export class DivElement extends ComponentWithChildren<HTMLDivElement> {
//   createDOM() {
//     this.el = document.createElement("div");
//     this.createChildrenDOM();
//   }
//   updateDOM() {
//     this.updateChildrenDOM();
//   }
// }
// declare module "../component" {
//   interface ElementFuncs {
//     div: [DivElement, [inner: ViewRender], null];
//   }
// }
// registerElement(function div(id: string, inner: ViewRender) {
//   return this.parent(id, DivElement, inner, {});
// });

declare module "../component" {
  interface TriggerComponents {
    button: [{}, [text: D<string>], MouseEvent];
  }
}
defineTrigger({}, function button(_, text: D<string>) {
  _._button(
    {
      onclick: _.$fire,
    },
    getD(text)
  );
});


declare module "../component" {
  interface StatusComponents {
    textInput: [{}, [label: D<string>, value: D<string>]];
  }
}
defineStatus({},function textInput(_, label: D<string>, value: D<string>) {
  const inputEl = ref<HTMLInputElement>();
  _._label({}, () => {
    _._t(label);
    _.$ref(inputEl) &&
      _._input({
        value: getD(value),
        oninput:  () => {
          inputEl.current && _.$setD(value, inputEl.current.value);
        },
        onfocus: _.$on,
        onblur: _.$off,
      });
  });
});

// export class ParagraphElement extends Component<HTMLParagraphElement> {
//   text: D<string>;
//   createDOM() {
//     this.el = document.createElement("p");
//   }
//   updateDOM() {
//     this.el.textContent = getD(this.text);
//   }
// }
// declare module "../component" {
//   interface ElementFuncs {
//     p: [ParagraphElement, [text: D<string>], null];
//   }
// }
// registerElement(function p(id: string, text: D<string>) {
//   return this.child(id, ParagraphElement, { text });
// });

// export class SpanElement extends Component<HTMLSpanElement> {
//   text: D<string>;
//   createDOM() {
//     this.el = document.createElement("span");
//   }
//   updateDOM() {
//     this.el.textContent = getD(this.text);
//   }
// }
// declare module "../component" {
//   interface ElementFuncs {
//     t: [SpanElement, [text: D<string>], null];
//     span: [SpanElement, [text: D<string>], null];
//   }
// }
// registerElement(function t(id: string, text: D<string>) {
//   return this.child(id, SpanElement, { text });
// });
// registerElement(function span(id: string, text: D<string>) {
//   return this.child(id, SpanElement, { text });
// });

// export class NumberInputElement extends Component<HTMLLabelElement> {
//   label: D<string>;
//   value: D<number>;
//   inputEl: HTMLInputElement;
//   textNode: Text;
//   createDOM() {
//     this.el = document.createElement("label");
//     this.inputEl = document.createElement("input");
//     this.textNode = document.createTextNode(___);
//     this.el.style.display = "block";
//     this.inputEl.type = "number";
//     this.el.addEventListener("input", (e) => {
//       //@ts-ignore
//       this.setD(this.value, +e.target["value"]);
//     });
//     this.el.appendChild(this.textNode);
//     this.el.appendChild(this.inputEl);
//   }
//   updateDOM() {
//     this.textNode.data = getD(this.label);
//     this.inputEl.value = getD(this.value).toString();
//   }
// }
// declare module "../component" {
//   interface ElementFuncs {
//     numberInput: [
//       NumberInputElement,
//       [label: D<string>, value: D<number>],
//       null,
//     ];
//   }
// }
// registerElement(function numberInput(
//   id: string,

//   label: D<string>,
//   value: D<number>
// ) {
//   return this.child(id, NumberInputElement, { label, value });
// });

// export class TextInputElement extends Component<HTMLLabelElement> {
//   label: D<string>;
//   value: D<string>;
//   inputEl: HTMLInputElement;
//   textNode: Text;
//   createDOM() {
//     this.el = document.createElement("label");
//     this.inputEl = document.createElement("input");
//     this.textNode = document.createTextNode(___);
//     this.el.style.display = "block";
//     this.inputEl.type = "text";
//     this.inputEl.addEventListener("input", (e) => {
//       //@ts-ignore
//       this.setD(this.value, e.target["value"]);
//     });
//     this.el.appendChild(this.textNode);
//     this.el.appendChild(this.inputEl);
//   }
//   updateDOM() {
//     this.textNode.data = getD(this.label);
//     this.inputEl.value = getD(this.value);
//   }
// }
// declare module "../component" {
//   interface ElementFuncs {
//     textInput: [TextInputElement, [label: D<string>, value: D<string>], null];
//   }
// }
// registerElement(function textInput(
//   id: string,

//   label: D<string>,
//   value: D<string>
// ) {
//   return this.child(id, TextInputElement, { label, value });
// });

// export class StyleElement extends Component<HTMLStyleElement> {
//   source: D<string>;
//   createDOM() {
//     this.el = document.createElement("style");
//   }
//   updateDOM() {
//     this.el.innerHTML = getD(this.source);
//   }
// }
// declare module "../component" {
//   interface ElementFuncs {
//     style: [NumberInputElement, [source: D<string>], null];
//   }
// }
// registerElement(function style(
//   id: string,

//   source: D<string>
// ) {
//   return this.child(id, StyleElement, { source });
// });

// export class TableElement extends ComponentWithChildren<HTMLTableElement> {
//   createDOM() {
//     this.el = document.createElement("table");
//     this.createChildrenDOM();
//   }
//   updateDOM() {
//     this.updateChildrenDOM();
//   }
// }
// declare module "../component" {
//   interface ElementCustomFuncs {
//     table<Item = unknown>(
//       data: D<Item[]>,
//       key: keyof Item | ((item: Item) => D<string>),
//       rowProc: (item: Item) => void
//     ): this is Context<TableElement, never>;
//   }
// }
// registerElement(function table<Item>(
//   this: View,
//   id: string,

//   data: D<Item[]>,
//   key: keyof Item | ((item: Item, index: number) => D<string>),
//   rowProc: (item: Item, index: number) => D<string>
// ) {
//   return this.parent(
//     id,
//     TableElement,
//     () => {
//       this._.for(data, key, (item, index) => {
//         this._.tr(() => rowProc(item, index));
//       });
//     },
//     {}
//   );
// });

// export class TableRowElement extends ComponentWithChildren<HTMLTableRowElement> {
//   createDOM() {
//     this.el = document.createElement("tr");
//     this.createChildrenDOM();
//   }
//   updateDOM() {
//     this.updateChildrenDOM();
//   }
// }
// declare module "../component" {
//   interface ElementFuncs {
//     tr: [TableRowElement, [inner: ViewRender], null];
//   }
// }
// registerElement(function tr(id: string, inner: ViewRender) {
//   return this.parent(id, TableRowElement, inner, {});
// });

// export class TableCellElement extends ComponentWithChildren<HTMLTableCellElement> {
//   createDOM() {
//     this.el = document.createElement("td");
//     this.createChildrenDOM();
//   }
//   updateDOM() {
//     this.updateChildrenDOM();
//   }
// }
// declare module "../component" {
//   interface ElementFuncs {
//     td: [TableCellElement, [inner: ViewRender], null];
//   }
// }
// registerElement(function td(id: string, inner: ViewRender) {
//   return this.parent(id, TableCellElement, inner, {});
// });

// export class UnorderedListElement extends ComponentWithChildren<HTMLUListElement> {
//   createDOM() {
//     this.el = document.createElement("ul");
//     this.createChildrenDOM();
//   }
//   updateDOM() {
//     this.updateChildrenDOM();
//   }
// }
// export class ListItemElement extends ComponentWithChildren<HTMLLIElement> {
//   createDOM() {
//     this.el = document.createElement("li");
//     this.createChildrenDOM();
//   }
//   updateDOM() {
//     this.updateChildrenDOM();
//   }
// }
// declare module "../component" {
//   interface ElementFuncs {
//     ul: [UnorderedListElement, [inner: ViewRender], null];
//     li: [ListItemElement, [inner: ViewRender], null];
//   }
//   interface ElementCustomFuncs {
//     ulist<Item = unknown>(
//       data: D<Item[]>,
//       key: keyof Item | ((item: Item, index: number) => D<string>),
//       rowProc: (item: Item, index: number) => void
//     ): this is Context<UnorderedListElement, never>;
//   }
// }
// registerElement(function ul(id: string, inner: ViewRender) {
//   return this.parent(id, UnorderedListElement, inner, {});
// });
// registerElement(function li(id: string, inner: ViewRender) {
//   return this.parent(id, ListItemElement, inner, {});
// });
// registerElement(function ulist<Item>(
//   this: View,
//   id: string,

//   data: D<Item[]>,
//   key: keyof Item | ((item: Item, index: number) => D<string>),
//   rowProc: (item: Item, index: number) => D<string>
// ) {
//   return this.parent(
//     id,
//     UnorderedListElement,
//     () => {
//       this._.for(data, key, (item, index) => {
//         this._.li(() => rowProc(item, index));
//       });
//     },
//     {}
//   );
// });
