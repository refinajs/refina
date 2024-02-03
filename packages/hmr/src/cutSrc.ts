import t from "@babel/types";
import MagicString from "magic-string";

export function cutSrc(src: string, stmtsToRemove: t.Statement[]) {
  const s = new MagicString(src);
  for (const statement of stmtsToRemove) {
    s.remove(statement.start!, statement.end!);
  }
  return s;
}
