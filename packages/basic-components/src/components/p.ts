import { Component, Content, _ } from "refina";

export class BasicP extends Component {
  $main(children: Content): void {
    _._p({}, children);
  }
}
