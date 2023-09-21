import { $cls } from "../../lib";

export default {
  container: $cls`relative mx-2 mt-2 mb-7`,
  label: (inputing: boolean, invalid: boolean) =>
    $cls`absolute pointer-events-none transition-all duration-75 ${
      invalid ? "text-red-500" : inputing ? "text-gray-600" : ""
    } ${inputing ? "text-xs top-2 start-4" : "text-base top-4 start-4"}`,
  inputEl: $cls`border-black border rounded pt-7 pb-1 px-4 text-base transition-colors hover:bg-gray-100`,
  invalidMsg: $cls`absolute pl-3 text-red-500 text-sm`,
};
