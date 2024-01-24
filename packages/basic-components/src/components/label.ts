import { Component, Content, _ } from "refina";

export class BasicLabel extends Component {
  $main(inner: Content): void {
    _._label({}, inner);
  }
}
