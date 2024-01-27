import { Component, Content, _ } from "refina";

export class BasicDiv extends Component {
  $main(children?: Content): void {
    _._div({}, children);
  }
}
