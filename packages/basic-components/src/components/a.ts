import { Component, Content, _ } from "refina";

export class BasicA extends Component {
  $main(inner: Content, href: string): void {
    _._a({ href }, inner);
  }
}
