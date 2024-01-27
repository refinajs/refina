import { Component, Content, _ } from "refina";

export class MdLayoutMain extends Component {
  $main(children: Content): void {
    _._mdui_layout_main({}, children);
  }
}
