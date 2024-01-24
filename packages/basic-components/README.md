# `@refina/basic-components`

[![npm](https://img.shields.io/npm/v/%40refina%2Fbasic-components?color=green)](https://www.npmjs.com/package/@refina/basic-components)

The basic components of Refina.

To know more about Refina, please visit:

- [Documentation](https://refina.vercel.app).
- [Getting Started](https://refina.vercel.app/guide/introduction.html)
- [GitHub Repository](https://github.com/refinajs/refina).
- [Examples](https://gallery.refina.vercel.app).

## Usage

### Install the Plugin to App

```ts
import Basics from "@refina/basic-components";

$app([Basics], _ => {
  // ...
});
```

### Use the Components

All the components of this package doesn't have a prefix.

```ts
if (_.button("button")) {
  console.log("Button clicked");
}
```

## Included Components

- `a`
- `br`
- `button`
- `div`
- `h1`
- `h2`
- `h3`
- `h4`
- `h5`
- `h6`
- `img`
- `input`
- `textInput`
- `passwordInput`
- `checkbox`
- `label`
- `li`
- `ol`
- `p`
- `span`
- `table`
- `th`
- `td`
- `textarea`
- `ul`
