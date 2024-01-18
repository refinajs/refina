/// <reference types="vite/client" />
import MdUI, { CheckboxState } from "@refina/mdui";
import { $app, $view, Content, bySelf, model } from "refina";
import "./styles.css";

const ShowComponent = $view((_, name: string, inner: Content) => {
  _._div({}, _ => {
    _.$css`margin-bottom:8px`;
    _._h3({}, name);
    _.embed(inner);
  });
});

let darkMode = false;
let count = 0;
let status = model(false);
let status2 = model<CheckboxState>(undefined);
const options = ["Option 1", "Option 2", "Option 3"] as const;
let selected = model<(typeof options)[number]>(options[0]);
let sliderValue1 = model(40);
let sliderValue2 = model(60);
let input = model("Hello");

$app.use(MdUI)(_ => {
  _.useMdTheme(darkMode ? "dark" : "light");

  _.$css`z-index:1999`;
  _.mdTopAppBar(
    _ => {
      _.$css`font-size: 2em; margin-right: 24px`;
      _._span({}, "MDUI Test");
      _._div({}, _ => {
        _._span({}, "Status: ");
        _.$css`font-family:Consolas`;
        _._div(
          {},
          `${count} ${status.value} ${selected.value} ${sliderValue1.value} ${sliderValue2.value}`,
        );
      });
    },
    _ =>
      _.mdIconButton(darkMode ? "dark_mode" : "light_mode") &&
      (darkMode = !darkMode),
  );

  _.mdLayoutMain(_ => {
    _(ShowComponent)("Avatar", _ => {
      _.mdAvatar("https://via.placeholder.com/80x80?text=A");
      _.mdIconAvatar("person");
    });
    _(ShowComponent)("Badge", _ => {
      _.mdBadge();
      _.t` `;
      _.mdBadge("99+");
    });
    _(ShowComponent)("Button", _ => {
      _.mdButton("Button") && count++;
      _.mdButton("Button", true) && count++;
      _.mdTonalButton("Tonal") && count++;
      _.mdOutlinedButton("Outlined") && count++;
      _.mdTextButton("Text") && count++;
    });
    _(ShowComponent)("Button Icon", _ => {
      _.mdIconButton("add") && count++;
      _.mdIconButton("add", true) && count++;
      _.mdFilledIconButton("add") && count++;
      _.mdOutlinedIconButton("add") && count++;
      _.mdTonalIconButton("add") && count++;
    });
    _(ShowComponent)("Checkbox", _ => {
      _.mdCheckbox(status, "Checkbox");
      _.mdCheckbox(status, "Checkbox", true);
      _.mdCheckbox(status2, "Checkbox");
    });
    _(ShowComponent)("Chip", _ => {
      _.mdChip("Student");
      _.mdChip("Student", true);
      _.$prop("icon", "person") &&
        _.$prop("endIcon", "arrow_forward") &&
        _.mdChip("Student", true);
      _.mdSelectableChip(status, "Student");
      _.mdDeletableChip("Student") && alert("Deleted!");
      _.$prop("deleteIcon", "backspace") &&
        _.mdDeletableChip("Student", true) &&
        alert("Deleted!");
    });
    _(ShowComponent)("Circlular Progress", _ => {
      _.mdCircularProgress();
      _.mdCircularProgress(0.8);
    });
    _(ShowComponent)("Collapse", _ => {
      _.mdCollapse("Header", "Content");
      _.$prop("icon", "near_me");
      _.mdCollapse("Header", "Content");
      _.mdCollapse("Header (disabled)", "Content", true);
    });
    _(ShowComponent)("Dialog", _ => {
      _.mdDialog(
        (_, open) => _.mdButton("Open Dialog") && open(),
        "Title",
        "Content",
        (_, close) => {
          _.mdButton("YES") && close();
          _.mdButton("NO") && close();
        },
      );
    });
    _(ShowComponent)("Divider", _ => {
      _.mdDivider();
      _.$css`height: 40px; margin-left: 30px`;
      _._div({}, _ => _.mdVerticalDivider());
    });
    _(ShowComponent)("Fab", _ => {
      _.mdFab("add") && count++;
      _.mdFab("add", true) && count++;
      _.mdFab("add", false, "Plus 1") && count++;
    });
    _(ShowComponent)("Icon", _ => {
      _.mdIcon("search");
      _.mdIcon("delete");
    });
    _(ShowComponent)("Linear Progress", _ => {
      _.mdLinearProgress();
      _.mdLinearProgress(sliderValue1.value / 100);
    });
    _(ShowComponent)("List", _ =>
      _.mdList(["Item 1", "Item 2", "Item 3"], bySelf, item => {
        _.t(item);
      }),
    );
    _(ShowComponent)("Prose", _ => {
      _.$css`border:2px black solid;border-radius:5px;padding:10px;`;
      _._div({}, _ =>
        _.mdProse(_ => {
          _._h1({}, "Title");
          _._p({}, "Content");
          _._p({}, "Content");
          _._p({}, "Content");
          _._p({}, "Content");
        }),
      );
    });
    _(ShowComponent)("Radio Group", _ => {
      _.mdRadioGroup(selected, options);
      _._br();
      _.mdRadioGroup(selected, options, [false, true], {
        "Option 3": _ => _.mdAvatar("https://via.placeholder.com/80x80?text=3"),
      });
      _._br();
      _.mdRadioGroup(selected, options, true);
    });
    _(ShowComponent)("Range Slider", _ => {
      _.mdRangeSlider(sliderValue1, sliderValue2);
      _.mdRangeSlider(sliderValue1, sliderValue2, false, 10);
      _.mdRangeSlider(sliderValue1, sliderValue2, true);
    });
    _(ShowComponent)("Segmented Button", _ => {
      _.mdSegmentedButton(["+1", "+2", "+3"]) && (count += _.$ev + 1);
      _._br();
      _.mdSegmentedButton(["+1", "+2", "+3"], true) && (count += _.$ev + 1);
      _._br();
      _.mdSegmentedButton(["+1", "+2", "+3"], [true]) && (count += _.$ev + 1);
      _._br();
      _.$props({
        icons: ["add", "add", "add"],
        endIcons: ["star_border", , "star"],
      }) &&
        _.mdSegmentedButton([1, 2, 3]) &&
        (count += _.$ev + 1);
    });
    _(ShowComponent)("Select", _ => {
      _.mdSelect(selected, options);
      _.mdSelect(selected, options, [false, true], {
        "Option 3": _ => _.mdAvatar("https://via.placeholder.com/80x80?text=3"),
      });
      _.mdSelect(selected, options, true);
      _.mdOutlinedSelect(selected, options);
    });
    _(ShowComponent)("Slider", _ => {
      _.mdSlider(sliderValue2);
      _.mdSlider(sliderValue2, false, 10);
      _.mdSlider(sliderValue2, true);
    });
    _(ShowComponent)("Switch", _ => {
      _.mdSwitch(status);
      _.mdSwitch(status, true);
    });
    _(ShowComponent)("Table", _ => {
      const data = [
        { name: "Alice", age: 20 },
        { name: "Bob", age: 21 },
        { name: "Carol", age: 22 },
      ];
      _.mdTable(
        data,
        [_ => _.mdIcon("person"), "Age", "Action"],
        "name",
        item => {
          _.mdTableCell(item.name);
          _.mdTableCell(item.age);
          _.mdTableCell(_ => _.mdButton("Open") && alert(item.name));
        },
      );
    });
    _(ShowComponent)("Tabs", _ => {
      _.mdTabs(
        "Tab 1",
        _ => _._p({}, "Content 1"),
        "Tab 2",
        _ => _._p({}, "Content 2"),
        "Tab 3",
        _ => _._p({}, "Content 3"),
      );
    });
    _(ShowComponent)("Text Field", _ => {
      _.mdTextField(input);
      _.mdTextField(input, "Message");
      _.mdTextField(input, "Message", true);
      _.mdOutlinedTextField(input, "Message");
      _.mdPasswordInput(input, "Password");
      _.mdOutlinedPasswordInput(input, "Password");
      _.mdTextarea(input, "Message (3 rows)");
      _.$props({ rows: [2, 5] }) && _.mdTextarea(input, "Message (2-5 rows)");
    });
    _(ShowComponent)("Tooltip", _ => {
      _.mdTooltip("Message", _ => _.mdButton("Hover me!")) &&
        console.log(_.$ev);
    });
    _(ShowComponent)("Layouts", _ => {
      const exampleWindowStyle =
        "z-index:0;height:400px;border:1px black solid;margin:20px;padding:10px;border-radius:5px;";
      _.$css(exampleWindowStyle);
      _.mdLayout(_ => {
        _.mdTopAppBar(_ => {
          _.mdIconButton("menu");
          _.mdTopAppBarTitle("Title");
        });
        const currentPage = _.mdNavBar([
          ["Home", "home"],
          ["About", "info"],
        ]);
        _.mdLayoutMain(_ => {
          _.forTimes(50, index => _._p({}, `${currentPage} content ${index}`));
        });
      });
      _.$css(exampleWindowStyle);
      _.mdLayout(_ => {
        _.mdBottomAppBar("BOTTOM APP BAR");
        const currentPage = _.mdNavRail(
          [
            ["Home", "home"],
            ["About", "info"],
          ],
          {},
          _ => _.mdFab("edit"),
        );
        _.mdLayoutMain(_ => {
          _.forTimes(50, index => _._p({}, `${currentPage} content ${index}`));
        });
      });
      _.$css(exampleWindowStyle);
      _.mdLayout(_ => {
        _.mdLayoutMain(_ => {
          _._h1({}, "Layout Main");
          _.$prop("contained", true);
          _.mdNavDrawer(
            (_, open) => _.mdButton("open drawer") && open(),
            (_, close) => _.mdButton("close drawer") && close(),
            true,
          );
        });
      });
    });
  });
});
