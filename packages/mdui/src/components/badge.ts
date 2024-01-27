import { Component, Content, _ } from "refina";

export class MdBadge extends Component {
  $main(children?: Content | undefined): void {
    if (children === undefined) {
      _._mdui_badge({
        variant: "small",
      });
    } else {
      _._mdui_badge(
        {
          variant: "large",
        },
        children,
      );
    }
  }
}
