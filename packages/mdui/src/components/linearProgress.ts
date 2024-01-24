import { Component, _ } from "refina";

export class MdLinearProgress extends Component {
  $main(percentage?: number | undefined): void {
    _._mdui_linear_progress({
      value: percentage,
    });
  }
}
