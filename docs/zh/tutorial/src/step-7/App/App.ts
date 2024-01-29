import { $app, model } from "refina";
import Basics from "@refina/basic-components";
let id = 0;
let newTodo = model("");
let todos = [{
  id: id++,
  text: "Learn HTML"
}, {
  id: id++,
  text: "Learn JavaScript"
}, {
  id: id++,
  text: "Learn Refina"
}];
function remove(id: number) {
  todos = todos.filter(todo => todo.id !== id);
}
$app([Basics], _ => {
  _.textInput(newTodo);
  _.button("Add Todo") && todos.push({
    id: id++,
    text: newTodo.value
  });

  // Finish the following code to render the list of todos.
  // _.ul(todos, ...);
});
declare module "refina" {
  interface Plugins {
    Basics: typeof Basics;
  }
}