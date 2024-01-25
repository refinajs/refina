export default (head: string) => `<!doctype html>
<html>
  <head>${head}
    <script type="module" src="./src/app.ts"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`;
