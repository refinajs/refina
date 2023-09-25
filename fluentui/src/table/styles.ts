import { $cls } from "refina";

export default {
  table: $cls`m-3 border border-gray-700 rounded shadow-md`,
  thead: $cls`bg-gray-400`,
  th: $cls`p-2 hover:bg-gray-500 transition`,
  tbody: $cls`bg-gray-200`,
  tr: $cls`border-b border-gray-400 hover:bg-gray-300 transition`,
  td: (hover: boolean) =>
    $cls`p-2 ${hover ? `hover:bg-blue-200 transition` : ""}`,
};
