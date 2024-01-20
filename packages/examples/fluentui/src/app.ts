import FluentUI, {
  BrandVariants,
  Theme,
  createDarkTheme,
  createLightTheme,
} from "@refina/fluentui";
import { $app, byIndex, model, valueOf } from "refina";
import "@refina/fluentui-icons/person.ts";

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

const switchTest = model(true);
const checkboxSources = [model(false), model(false), model(true), model(false)];
const sliderTest = model(5);
const dropdownTest = model("");
const textInputTest = model("");
const numberInputTest = model(NaN);

$app.use(
  FluentUI,
  darkTheme,
  lightTheme,
)(_ => {
  _.fDivider("avatar");
  _.$css`display:flex;gap:10px`;
  _._div({}, _ => {
    _.fAvatar("John Doe", "active");
    _.fAvatar("https://placekitten.com/200/300", "inactive");
    _.fAvatar(_ => _.fiPersonFilled(), "inactive");
  });

  _.fDivider("button");
  _.fButton("Button");
  _.fPrimaryButton("Primary Button");
  _.fCircularButton("Circular Button");

  _.fDivider("switch");
  _.fSwitch("Switch", switchTest);
  _.fSwitch("Switch (Disabled)", switchTest, true);

  _.fDivider("checkbox");
  _.for(checkboxSources, byIndex, (source, index) =>
    _.fCheckbox(`Checkbox ${index}`, source),
  );
  _._br();
  const sourcesSet = new Set(checkboxSources.map(valueOf));
  const mixedState = sourcesSet.has(true)
    ? sourcesSet.has(false)
      ? "mixed"
      : true
    : false;
  if (_.fCheckbox("Checkbox (Mixable)", mixedState)) {
    checkboxSources.forEach(source => (source.value = _.$ev));
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
  _.fDropdown(
    dropdownTest,
    ["111", "222", "333", "444"],
    [false, true, false, false],
    "placeholder",
  );

  _.fDivider("input");
  _.fInput(textInputTest, false, "text input");
  _._br();
  _.fNumberInput(numberInputTest, false, "number input");
  _._br();
  _.fPasswordInput(textInputTest, false, "password input");
  _._br();
  _.fInput(textInputTest, true, "test");
  _._br();
  _.fUnderlineInput(textInputTest, false, "underline");

  _.fDivider("tabs");
  _.fTabs(
    "First Tab",
    "AAA",
    "Second Tab",
    "BBB",
    "Third Tab",
    "CCC",
    "Fourth Tab",
    "DDD",
  );

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

  _.fDivider("popover");
  _.fPopover(
    (_, targetRef, open) => {
      _.$ref(targetRef) && _.fButton("Popover Trigger") && open();
    },
    (_, close) => {
      _._h1({}, "Title");
      _._p({}, "Content content content content");
      _.fButton("Close") && close();
    },
  );

  _.fDivider("accordion");
  if (_.fAccordion("Header")) {
    _._p({}, "Content content content content ".repeat(10));
  }

  _.fDivider("field");
  _.fField(
    _ => {
      _.fInput(textInputTest, false, "test");
    },
    "Username",
    true,
    "error",
    "Validation Message",
  );

  _.fDivider("tooltip");
  _.fTooltip(_ => {
    _.fButton("[ ]");
  }, "tooltip content");

  _.fDivider("textarea");
  _.fTextarea(textInputTest, false, "placeholder", "both");
});
