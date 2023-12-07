import chalk from "chalk";

const text = `Refina.js - An extremely refined web framework`;
const startColor = [254, 204, 143];
const endColor = [255, 85, 0];

function getColor(index: number) {
  const percent = index / text.length;
  const color = startColor.map((start, i) => {
    const end = endColor[i];
    const value = Math.round(start + (end - start) * percent);
    return value;
  });
  return color as [number, number, number];
}

function getColoredText() {
  return text
    .split("")
    .map((char, index) => {
      const color = getColor(index);
      return chalk.rgb(...color)(char);
    })
    .join("");
}

export const banner = getColoredText();
