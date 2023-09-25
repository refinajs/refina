import { maybe, view } from "refina";
import { userId } from "./store";
let x = 0;

const things = [
  { name: "thing1", id: 1, price: 400 },
  { name: "thing2", id: 2, price: 200 },
  { name: "thing3", id: 3, price: 500 },
  { name: "thing4", id: 4, price: 100 },
  { name: "thing5", id: 5, price: 300 },
];

const currentThing = maybe<(typeof things)[0]>();
const test = maybe<{ a: 1 }>();

export default view((_) => {
  _.setInterval(() => {
    x++;
  }, 500);
  if (_.rCard(`Dashboard ${x}`, () => _.p(`Now is ${_.now()}`), ["Logout"])) {
    userId.value = NaN;
    _.$router.goto(`/login`);
  }
  _.rCard(`Test`, () => {
    if (
      _.rRowClickableTable(things, {
        name: {},
        price: {
          sortable: true,
        },
        id: true,
      })
    ) {
      currentThing.value = _.$ev;
    }

    if (
      _.rCellClickableTable(things, {
        name: {
          pos: 0,
        },
        price: true,
        id: true,
      })
    ) {
      console.warn(_.$ev);
    }
  });

  _.rDialog(
    currentThing,
    (_, thing) => _.t`Detail of ${thing.name}`,
    (_, thing) => {
      _.p(`Price: ${thing.price}`);
      _.p(`Id: ${thing.id}`);
      if (_.rButton("test")) {
        test.value = { a: 1 };
      }
      _.rDialog(
        test,
        () => _.t`Test ${thing.name}`,
        (_, test) => _.p(`A: ${test.a}`),
        "close",
      );
    },
    "close",
  );
});
