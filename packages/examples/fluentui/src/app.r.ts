import { BrandVariants, Theme, createDarkTheme, createLightTheme } from "@refina/fluentui";
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

const switchTest = d(true);
const checkboxSources = [d(false), d(false), d(true), d(false)];
const sliderTest = d(5);
const dropdownTest = d("");
const textInputTest = d("");

app((_) => {
  _.useTheme(darkTheme, lightTheme);

  _.fDivider("button");
  _.fButton("Button");
  _.fPrimaryButton("Primary Button");
  _.fCircularButton("Circular Button");

  _.fDivider("switch");
  _.fSwitch("Switch", switchTest);
  _.fSwitch("Switch (Disabled)", switchTest, true);

  _.fDivider("checkbox");
  _.for(checkboxSources, byIndex, (source, index) => _.fCheckbox(`Checkbox ${index}`, source));
  _._br();
  const sourcesSet = new Set(checkboxSources.map(getD));
  const mixedState = sourcesSet.has(true) ? (sourcesSet.has(false) ? "mixed" : true) : false;
  if (_.fCheckbox("Checkbox (Mixable)", mixedState)) {
    checkboxSources.forEach((source) => (source.value = _.$ev));
  }
  _._br();
  _.fCheckbox("Checkbox (Disabled)", true, true);

  _.fDivider("progress bar");
  _.fProgressBar("indertermine");
  _._br();
  _.fProgressBar(0.5, "warning");

  _.fDivider("slider");
  _.t`${sliderTest}`;
  _._br();
  _.fSlider(sliderTest, false, 3, 13, 2);
  _._br();
  _.fSlider(sliderTest, true);

  _.fDivider("dropdown");
  _.t(dropdownTest.value ?? "unselected");
  _._br();
  _.fDropdown(dropdownTest, ["111", "222", "333", "444"], [false, true, false, false], "placeholder");

  _.fDivider("text input");
  _.fTextInput(textInputTest, false, "test");
  _._br();
  _.fTextInput(textInputTest, true, "test");

  _.fDivider("tabs");
  _.fTabs("First Tab", "AAA", "Second Tab", "BBB", "Third Tab", "CCC", "Fourth Tab", "DDD");

  _.fDivider("dialog");
  _.fDialog(
    (_, open) => {
      _.fButton("Open") && open();
    },
    "Title",
    "Content",
    (_, close) => {
      if (_.fButton("Action1")) {
        close();
      }
      _.fPrimaryButton("Action2");
    },
    "end",
    false,
  );
});
