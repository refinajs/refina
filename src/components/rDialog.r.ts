import { Content, D, OutputComponent, OutputComponentContext, getD, outputComponent } from "../lib";

@outputComponent("rDialog")
export class RDialog extends OutputComponent {
  main(_: OutputComponentContext<this>, open: D<boolean>, inner: D<Content>) {
    if (getD(open)) {
      _.$cls`z-[2400] bg-[rgba(0,0,0,0.32)] fixed w-full h-full top-0 left-0 justify-center items-center flex`;
      _.button(() => {
        _.$cls`max-w-[calc(100%-48px)] w-auto text-left`;
        _.div(inner);
      }) &&
        _.$ev.$isCurrent &&
        _.$setD(open, false);
    }
  }
}

declare module "../component/index" {
  interface OutputComponents {
    rDialog: RDialog;
  }
}
