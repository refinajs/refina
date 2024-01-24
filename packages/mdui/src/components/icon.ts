import { Component, _ } from "refina";

export class MdIcon extends Component {
  $main(name: string): void {
    _._mdui_icon({
      name,
    });
  }
}
