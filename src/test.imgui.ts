// import { ButtonElement } from "./components/basic.imgui";
import "./loop";
import "./components/breadcrumb.imgui";
import { d, ref, view, toRaw } from "./lib";
import { byIndex, bySelf } from "./loop";

// let username = d("");
// let password = d("");
// let name = d("");
// let age = d(0);
// let table = d([
//   { name: "John", age: 20 },
//   { name: "Mary", age: 30 },
//   { name: "Bob", age: 40 },
// ]);
// let btn = ref<ButtonElement>();
// let btn2 = ref<ButtonElement>();
/*_.div<"#main">(() => {
    _.p<"{font-size:x-large}">(`Login to ZVMS`);
    _.textInput("Username: ", username);
    _.textInput("Password: ", password);
    if (_.button<".primary-btn">("Login").as(btn)) {
      alert(`${username} : ${password}`);
    }
    let valid = username.value.length > 0 && password.value.length > 0;
    btn.current.disabled = !valid;
    if (!valid) {
      _.p(`Please enter a username and password`);
    }
    _.style(`
    .primary-btn {
      background-color: aliceblue;
      border: 2px solid black;
    }`);
  });*/

const name = d("");
const age = d(0);
const table = [
  { name: "John", age: 20 },
  { name: "Mary", age: 30 },
  { name: "Bob", age: 40 },
];
const btn = ref<any>();
view((_) => {
  // _.textInput("Username: ", name);
  // _.numberInput("Age: ", age);
  // if (_.$ref(btn) && _.button("Register")) {
  //   console.log("Register", name.value, age.value);
  //   table.push(toRaw({ name, age }));
  //   name.value = "";
  //   age.value = 0;
  //   _.$;
  // }
  // btn.current!.disabled = !(name.value.length > 0 && age.value > 0);
  // _.table<(typeof table)[number]>(table, "name", (row) => {
  //   _.td(() => {
  //     _.t(row.name);
  //   });
  //   _.td(() => {
  //     _.t(row.age.toString());
  //   });
  // });

  // _.div(() => {
  //   _.for(
  //     table,
  //     (item) => item.name,
  //     (item, index) => {
  //       _.p<"{border:1px black solid;}">(item.name + index);
  //     }
  //   );
  // });
  // _.forRange(10, (i) => {
  //   _.p(i.toString());
  // });
  // _.for([1, 1, 4, 5, 1, 4], byIndex, (i) => {
  //   _.p(i.toString());
  // });

  _.breadcrumb(table.map((item) => item.name));
  _.breadcrumb(table.map((item) => item.name));
  _.breadcrumb(table.map((item) => item.name));
  _.breadcrumb(table.map((item) => item.name));
  _.breadcrumb(table.map((item) => item.name));
  _.breadcrumb(table.map((item) => item.name));
  _.breadcrumb(table.map((item) => item.name));
  _.breadcrumb(table.map((item) => item.name));
  _.breadcrumb(table.map((item) => item.name));
  _.breadcrumb(table.map((item) => item.name));
  _.breadcrumb(table.map((item) => item.name));
  _.breadcrumb(table.map((item) => item.name));
  _.breadcrumb(table.map((item) => item.name));
  _.breadcrumb(table.map((item) => item.name));
  _.breadcrumb(table.map((item) => item.name));
  _.breadcrumb(table.map((item) => item.name));
  _.breadcrumb(table.map((item) => item.name));
  _.breadcrumb(table.map((item) => item.name));
  _.breadcrumb(table.map((item) => item.name));
  _.breadcrumb(table.map((item) => item.name));
  _.breadcrumb(table.map((item) => item.name));
  _.breadcrumb(table.map((item) => item.name));
  _.breadcrumb(table.map((item) => item.name));
  _.breadcrumb(table.map((item) => item.name));
  _.breadcrumb(table.map((item) => item.name));
  _.breadcrumb(table.map((item) => item.name));
});

// `
// p-10 flex flex-col items-center justify-center
//          p-5 bg-gray-100 rounded-lg shadow-2xl
//                      p-5 bg-gray-30 rounded-sm

//          p-5 bg-gray-100 rounded-lg shadow-2xl

//                                            red

//                                          green

// `
