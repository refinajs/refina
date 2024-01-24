import { Component, Content, _ } from "refina";

export class BasicSpan extends Component {
  $main(inner?: Content): void {
    _._span({}, inner);
  }
}
