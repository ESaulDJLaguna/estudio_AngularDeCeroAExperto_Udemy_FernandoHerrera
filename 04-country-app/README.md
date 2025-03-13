# CountryApp

## Instalar Tailwind

[Install Tailwind CSS with Angular](https://tailwindcss.com/docs/installation/framework-guides/angular)

### Install Tailwind CSS

Install `@tailwindcss/postcss` and its peer dependencies via npm.

```bash
npm install tailwindcss @tailwindcss/postcss postcss --force
```

### Configure PostCSS Plugins

Create a `.postcssrc.json` file in the root of your project and add the `@tailwindcss/postcss` plugin to your PostCSS configuration.

```json
// .postcssrc.json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

### Import Tailwind CSS

Add an `@import` to `./src/styles.css` that imports Tailwind CSS.

```bash
# styles.css
@import "tailwindcss";
# styles.scss
@use "tailwindcss";
```

## Instalar daisyUI

[Install daisyUI for Angular](https://daisyui.com/docs/install/angular/)

How to install daisyUI as a Tailwind CSS plugin?

You need **Node.js** and **Tailwind CSS** installed.

1. Install daisyUI as a Node package:

```bash
npm i -D daisyui@latest
```

2. Add daisyUI to app.css:

```bash
@plugin "daisyui";
```
