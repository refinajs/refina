import { Component, _ } from "refina";

export class BasicImg extends Component {
  $main(src: string, alt?: string): void {
    _._img({
      src,
      alt,
    });
  }
}
