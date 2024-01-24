import { Plugin } from "refina";
import * as c from "./components";

export default {
  name: "basic-components",
  components: {
    a: c.BasicA,
    br: c.BasicBr,
    button: c.BasicButton,
    checkbox: c.BasicCheckbox,
    div: c.BasicDiv,
    h1: c.BasicH1,
    h2: c.BasicH2,
    h3: c.BasicH3,
    h4: c.BasicH4,
    h5: c.BasicH5,
    h6: c.BasicH6,
    img: c.BasicImg,
    input: c.BasicInput,
    textInput: c.BasicTextInput,
    passwordInput: c.BasicPasswordInput,
    label: c.BasicLabel,
    li: c.BasicLi,
    ol: c.BasicOl,
    p: c.BasicP,
    span: c.BasicSpan,
    table: c.BasicTable,
    td: c.BasicTd,
    th: c.BasicTh,
    textarea: c.BasicTextarea,
    ul: c.BasicUl,
  },
} satisfies Plugin;

export * from "./components";
