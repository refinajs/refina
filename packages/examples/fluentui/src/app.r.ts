import { BrandVariants, Theme, createDarkTheme, createLightTheme, setTheme } from "@refina/fluentui";
import { app, byIndex, d, getD } from "refina";

const myNewTheme: BrandVariants = {
  10: "#020305",
  20: "#111723",
  30: "#16263D",
  40: "#193253",
  50: "#1B3F6A",
  60: "#1B4C82",
  70: "#18599B",
  80: "#1267B4",
  90: "#3174C2",
  100: "#4F82C8",
  110: "#6790CF",
  120: "#7D9ED5",
  130: "#92ACDC",
  140: "#A6BAE2",
  150: "#BAC9E9",
  160: "#CDD8EF",
};

const darkTheme: Theme = {
  ...createDarkTheme(myNewTheme),
};

const lightTheme: Theme = {
  ...createLightTheme(myNewTheme),
};

setTheme(darkTheme, lightTheme);

const test = d("");
const test1 = d(true);
const sources = [d(false), d(false), d(true), d(false)];
const slider = d(5);

app((_) => {
  _.fSwitch("Switch", test1);
  _._br();
  _.for(sources, byIndex, (source, index) => _.fCheckbox(`Checkbox ${index}`, source));
  _._br();
  const sourcesSet = new Set(sources.map(getD));
  const mixedState = sourcesSet.has(true) ? (sourcesSet.has(false) ? "mixed" : true) : false;
  if (_.fCheckbox("Checkbox (Mixable)", mixedState)) {
    sources.forEach((source) => (source.value = _.$ev));
  }

  _.fProgressBar("indertermine");
  _._br();
  _.fProgressBar(0.5, "warning");

  _._br();

  _.t`${slider}`;
  _._br();
  _.fSlider(slider, false, 3, 13, 2);

  _._br();
  _._br();

  _._h1({}, test.value ?? "unselected");
  _.fDropdown(test, ["111", "222", "333", "444"], [false, true, false, false], "placeholder");
});
// // _.rTextInput(test, false, "test");

// // _.rTabs("First Tab", "AAA", "Second Tab", "BBB", "Third Tab", "CCC", "Fourth Tab", "DDD");
