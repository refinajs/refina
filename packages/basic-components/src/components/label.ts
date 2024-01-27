import { Component, Content, _ } from "refina";

export class BasicLabel extends Component {
  $main(children: Content): void {
    _._label({}, children);
  }
}
