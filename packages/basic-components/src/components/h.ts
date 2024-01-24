import { Component, Content, _ } from "refina";

export class BasicH1 extends Component {
  $main(inner: Content): void {
    _._h1({}, inner);
  }
}

export class BasicH2 extends Component {
  $main(inner: Content): void {
    _._h2({}, inner);
  }
}

export class BasicH3 extends Component {
  $main(inner: Content): void {
    _._h3({}, inner);
  }
}

export class BasicH4 extends Component {
  $main(inner: Content): void {
    _._h4({}, inner);
  }
}

export class BasicH5 extends Component {
  $main(inner: Content): void {
    _._h5({}, inner);
  }
}

export class BasicH6 extends Component {
  $main(inner: Content): void {
    _._h6({}, inner);
  }
}
