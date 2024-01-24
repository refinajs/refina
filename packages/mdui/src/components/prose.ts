import { Component, Content, _ } from "refina";

export class MdProse extends Component {
  $main(inner: Content): void {
    _.$cls`mdui-prose`;
    _._div({}, inner);
  }
}
