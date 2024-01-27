import { Component, Content, _ } from "refina";

export class MdBottomAppBar extends Component {
  $main(children: Content): void {
    _._mdui_bottom_app_bar({}, children);
  }
}
