import { Component, _ } from "refina";

export class MdCircularProgress extends Component {
  $main(percentage?: number | undefined): void {
    _._mdui_circular_progress({
      value: percentage,
    });
  }
}
