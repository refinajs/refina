import { $app } from "refina";

/*
Rewrite the following HTML using low-level rendering functions.

<svg id="svg1" width="100" height="100" style="position:fixed;">
  <path d="M 10 10 H 90 V 90 H 10 Z" fill="red" />
  <circle cx="50" cy="50" r="40" stroke="blue" fill="none"/>
</svg>
*/

$app(_ => {
  _.$css`position:fixed;`;
  _._svgSvg({
    id: "svg1",
    width: 100,
    height: 100
  }, _ => {
    _._svgPath({
      d: "M 10 10 H 90 V 90 H 10 Z",
      fill: "red"
    });
    _._svgCircle({
      cx: 50,
      cy: 50,
      r: 40,
      stroke: "blue",
      fill: "none"
    });
  });
});