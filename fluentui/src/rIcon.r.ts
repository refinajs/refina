import type { MaterialIcon } from "material-icons";
import "material-icons/iconfont/material-icons.css";
import { D, OutputComponent, OutputComponentContext, getD, outputComponent } from "refina";

export type { MaterialIcon };

@outputComponent("mdIcon")
export class MDIcon extends OutputComponent {
  main(_: OutputComponentContext<this>, name: D<MaterialIcon>) {
    _.$cls`material-icons`;
    console.log(getD(name));
    _._span({}, getD(name));
  }
}

@outputComponent("mdOutlinedIcon")
export class MDOutlinedIcon extends OutputComponent {
  main(_: OutputComponentContext<this>, name: D<MaterialIcon>) {
    _.$cls`material-icons-outlined`;
    _._span({}, getD(name));
  }
}

@outputComponent("mdRoundIcon")
export class MDRoundIcon extends OutputComponent {
  main(_: OutputComponentContext<this>, name: D<MaterialIcon>) {
    _.$cls`material-icons-round`;
    _._span({}, getD(name));
  }
}

@outputComponent("mdSharpIcon")
export class MDSharpIcon extends OutputComponent {
  main(_: OutputComponentContext<this>, name: D<MaterialIcon>) {
    _.$cls`material-icons-sharp`;
    _._span({}, getD(name));
  }
}

@outputComponent("mdTwoToneIcon")
export class MDTwoToneIcon extends OutputComponent {
  main(_: OutputComponentContext<this>, name: D<MaterialIcon>) {
    _.$cls`material-icons-two-tone`;
    _._span({}, getD(name));
  }
}

declare module "refina" {
  interface OutputComponents {
    mdIcon: MDIcon;
    mdOutlinedIcon: MDOutlinedIcon;
    mdRoundIcon: MDRoundIcon;
    mdSharpIcon: MDSharpIcon;
    mdTwoToneIcon: MDTwoToneIcon;
  }
}
