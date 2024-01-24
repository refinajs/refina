import { Component, Content, _ } from "refina";

export class MdBadge extends Component {
  $main(inner?: Content | undefined): void {
    if (inner === undefined) {
      _._mdui_badge({
        variant: "small",
      });
    } else {
      _._mdui_badge(
        {
          variant: "large",
        },
        inner,
      );
    }
  }
}
