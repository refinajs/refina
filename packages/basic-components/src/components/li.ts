import { Component, Content, _ } from "refina";

export class BasicLi extends Component {
  $main(children: Content): void {
    _._li({}, children);
  }
}
