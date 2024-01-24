import { Component, Content, _ } from "refina";

export class BasicDiv extends Component {
  $main(inner?: Content): void {
    _._div({}, inner);
  }
}
