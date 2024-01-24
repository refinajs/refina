import { Component, Content, _ } from "refina";

export class MdLayout extends Component {
  $main(inner: Content): void {
    _._mdui_layout({}, inner);
  }
}
