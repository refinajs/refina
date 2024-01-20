import { FAvatarNamedColor } from "./types";

const avatarColors: FAvatarNamedColor[] = [
  "dark-red",
  "cranberry",
  "red",
  "pumpkin",
  "peach",
  "marigold",
  "gold",
  "brass",
  "brown",
  "forest",
  "seafoam",
  "dark-green",
  "light-teal",
  "teal",
  "steel",
  "blue",
  "royal-blue",
  "cornflower",
  "navy",
  "lavender",
  "purple",
  "grape",
  "lilac",
  "pink",
  "magenta",
  "plum",
  "beige",
  "mink",
  "platinum",
  "anchor",
];

const getHashCode = (str: string): number => {
  let hashCode = 0;
  for (let len: number = str.length - 1; len >= 0; len--) {
    const ch = str.charCodeAt(len);
    const shift = len % 8;
    hashCode ^= (ch << shift) + (ch >> (8 - shift)); // eslint-disable-line no-bitwise
  }

  return hashCode;
};

export function getColor(name: string) {
  return avatarColors[getHashCode(name) % avatarColors.length];
}
