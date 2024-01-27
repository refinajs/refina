import { Component, Content, _ } from "refina";

export class MdLayout extends Component {
  $main(children: Content): void {
    _._mdui_layout({}, children);
  }
}
