/// <reference types="vite/client" />
import MdUI2 from "@refina/mdui2";
import "@refina/mdui2/styles.css";
import { Content, app, bySelf, d, view } from "refina";

const componentView = view((_, name: string, inner: Content) => {
  _._div({}, _ => {
    _.$css`margin-bottom:8px`;
    _._h3({}, name);
    _.embed(inner);
  });
});

let count = 0;
let status = d(false);
const options = ["Option 1", "Option 2", "Option 3"] as const;
let selected = d<(typeof options)[number]>(options[0]);
let sliderValue1 = d(40);
let sliderValue2 = d(60);
let input = d("Hello");

app.use(MdUI2)(_ => {
  _._h1({}, "MDUI2 Test");

  _.$css`position:sticky;top:0;left:0;right:0;background-color:#AAA;z-index:100`;
  _._div({}, _ => {
    _._p({}, `Count is ${count}`);
    _._p({}, `Status is ${status.value}`);
    _._p({}, `Selected is ${selected.value}`);
    _._p({}, `Input is ${sliderValue1.value}`);
  });

  _.embed(componentView, "Avatar", _ => _.mdAvatar("https://via.placeholder.com/80x80?text=A"));
  _.embed(componentView, "Badge", _ => {
    _.mdBadge();
    _.t` `;
    _.mdBadge("99+");
  });
  _.embed(componentView, "Button", _ => {
    _.mdButton("Button") && count++;
    _.mdButton("Button", true) && count++;
  });
  _.embed(componentView, "Checkbox", _ => {
    _.mdCheckbox(status, "Checkbox");
    _.mdCheckbox(status, "Checkbox", true);
  });
  _.embed(componentView, "Circlular Progress", _ => {
    _.mdCircularProgress();
    _.mdCircularProgress(0.8);
  });
  _.embed(componentView, "Divider", _ => {
    _.mdDivider();
    _.$css`height: 40px; margin-left: 30px`;
    _._div({}, _ => _.mdVerticalDivider());
  });
  _.embed(componentView, "Linear Progress", _ => {
    _.mdLinearProgress();
    _.mdLinearProgress(sliderValue1.value / 100);
  });
  _.embed(componentView, "List", _ =>
    _.mdList(["Item 1", "Item 2", "Item 3"], bySelf, item => {
      _.t(item);
    }),
  );
  _.embed(componentView, "Radio Group", _ => {
    _.mdRadioGroup(selected, options);
    _._br();
    _.mdRadioGroup(selected, options, [false, true], {
      "Option 3": _ => _.mdAvatar("https://via.placeholder.com/80x80?text=3"),
    });
    _._br();
    _.mdRadioGroup(selected, options, true);
  });
  _.embed(componentView, "Range Slider", _ => {
    _.mdRangeSlider([sliderValue1, sliderValue2]);
    _.mdRangeSlider([sliderValue1, sliderValue2], false, 10);
    _.mdRangeSlider([sliderValue1, sliderValue2], true);
  });
  _.embed(componentView, "Select", _ => {
    _.mdSelect(selected, options);
    _.mdSelect(selected, options, [false, true], {
      "Option 3": _ => _.mdAvatar("https://via.placeholder.com/80x80?text=3"),
    });
    _.mdSelect(selected, options, true);
  });
  _.embed(componentView, "Slider", _ => {
    _.mdSlider(sliderValue2);
    _.mdSlider(sliderValue2, false, 10);
    _.mdSlider(sliderValue2, true);
  });
  _.embed(componentView, "Switch", _ => {
    _.mdSwitch(status);
    _.mdSwitch(status, true);
  });
  _.embed(componentView, "Tabs", _ => {
    _.mdTabs(
      "Tab 1",
      _ => _._p({}, "Content 1"),
      "Tab 2",
      _ => _._p({}, "Content 2"),
      "Tab 3",
      _ => _._p({}, "Content 3"),
    );
  });
  _.embed(componentView, "Text Field", _ => {
    _.mdTextField(input);
    _.mdTextField(input, "Message");
    _.mdTextField(input, "Message", true);
  });
  _.embed(componentView, "Tooltip", _ => {
    _.mdTooltip("Message", _ => _.mdButton("Hover me!")) && console.log(_.$ev);
  });
});
