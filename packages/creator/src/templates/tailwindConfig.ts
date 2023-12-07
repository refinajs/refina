export default `import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts}"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
`;
