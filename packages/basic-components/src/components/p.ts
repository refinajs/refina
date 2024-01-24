import { Component, Content, _ } from "refina";

export class BasicP extends Component {
  $main(inner: Content): void {
    _._p({}, inner);
  }
}
