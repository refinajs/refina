export default (head: string) => `<!doctype html>
<html>
  <head>${head}
    <script type="module" src="./src/app.ts"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;
