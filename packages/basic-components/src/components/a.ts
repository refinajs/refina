import { Component, Content, _ } from "refina";

export class BasicA extends Component {
  $main(children: Content, href: string, target?: string): void {
    _._a({ href, target }, children);
  }
}
