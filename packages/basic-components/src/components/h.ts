import { Component, Content, _ } from "refina";

export class BasicH1 extends Component {
  $main(children: Content): void {
    _._h1({}, children);
  }
}

export class BasicH2 extends Component {
  $main(children: Content): void {
    _._h2({}, children);
  }
}

export class BasicH3 extends Component {
  $main(children: Content): void {
    _._h3({}, children);
  }
}

export class BasicH4 extends Component {
  $main(children: Content): void {
    _._h4({}, children);
  }
}

export class BasicH5 extends Component {
  $main(children: Content): void {
    _._h5({}, children);
  }
}

export class BasicH6 extends Component {
  $main(children: Content): void {
    _._h6({}, children);
  }
}
