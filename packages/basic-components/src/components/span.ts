import { Component, Content, _ } from "refina";

export class BasicSpan extends Component {
  $main(children?: Content): void {
    _._span({}, children);
  }
}
