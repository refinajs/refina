import { Component, _ } from "refina";

export class MdDivider extends Component {
  $main(): void {
    _._mdui_divider();
  }
}

export class MdVerticalDivider extends Component {
  $main(): void {
    _._mdui_divider({
      vertical: true,
    });
  }
}
