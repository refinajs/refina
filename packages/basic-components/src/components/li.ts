import { Component, Content, _ } from "refina";

export class BasicLi extends Component {
  $main(inner: Content): void {
    _._li({}, inner);
  }
}
