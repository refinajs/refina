export default (noBase: boolean) => `
    <style>${
      noBase
        ? ""
        : `
      @tailwind base;`
    }
      @tailwind components;
      @tailwind utilities;
    </style>`;
