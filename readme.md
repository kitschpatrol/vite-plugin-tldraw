# @kitschpatrol/vite-plugin-tldraw

[![NPM Package](https://img.shields.io/npm/v/@kitschpatrol/vite-plugin-tldraw.svg)](https://npmjs.com/package/@kitschpatrol/vite-plugin-tldraw)

## Overview

**A [Vite](https://vitejs.dev) plugin to automate the import and conversion of local [tldraw](https://tldraw.dev) `.tldr` files into SVG or PNG image assets.**

This allows `.tldr` files to be imported just like regular `.webp`, `.jpeg` etc. files in Vite-powered projects:

```ts
// main.ts
import tldrImage from './assets/test-sketch.tldr'

const body = document.querySelector<HTMLDivElement>('body')
if (body) body.innerHTML = `<img src="${tldrImage}" />`
```

The above transforms `./assets/test-sketch.tldr` into `./assets/test-sketch-{hash}.svg`, caches the output file, and then returns an SVG URL ready to be passed to an `img` element's `src` attribute.

The plugin provides a global configuration object to customize of several aspects of the conversion process, and also allows overrides on a per-import basis via query parameters on the asset import path, e.g.:

```ts
import tldrImage from './assets/test-sketch.tldr?format=png&tldr'
```

_For lower-level processing of `.tldr` files in Node projects or via the command line, please see [@kitschpatrol/tldraw-cli](https://github.com/kitschpatrol/tldraw-cli)._

## Installation

### 1. Install the plugin package

Assuming you're starting with a Vite project of some flavor:

```sh
npm install --save-dev @kitschpatrol/vite-plugin-tldraw
```

### 2. Add the plugin to your `vite.config` file

```ts
// vite.config.ts
import tldraw from '@kitschpatrol/vite-plugin-tldraw'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tldraw()],
})
```

### 3. Configure TypeScript

_Skip this step if you're using plain JavaScript._

Add the extension declarations to your [types](https://www.typescriptlang.org/tsconfig#types) in tsconfig.json:

```json
{
  "compilerOptions": {
    "types": ["@kitschpatrol/vite-plugin-tldraw/ext"]
  }
}
```

Alternately, you can add a triple-slash package dependency directive to your global types file (e.g. `env.d.ts` or similar):

```ts
/// <reference types="@kitschpatrol/vite-plugin-tldraw/ext" />
```

This step should take care of errors like:

```sh
Cannot find module './assets/test-sketch.tldr' or its corresponding type declarations.ts(2307)'
```

## Usage

Save your tldraw project to a `.tldr` file.

Add it to your project, most likely in an `assets` folder.

Then simply import the `.tldr` file to get a working asset url:

```ts
// example.ts
import tldrImage from './assets/test-sketch.tldr'

// logs a working svg url
console.log(tldrImage)
```

See the sections below for additional conversion options.

## Plugin Options

`vite-plugin-tldraw` inherits most of the configuration flags available in [@kitschpatrol/tldraw-cli](https://github.com/kitschpatrol/tldraw-cli#command-line-usage).

### `TldrawPluginOptions`

| Key                   | Type                 | Description                                                                                                                                                                                                                                                   | Default     |
| --------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `cacheEnabled`        | `boolean`            | Caches generated image files. Hashes based on the source `.tldr` content _and_ any TldrawImageOptions or import query parameters ensure the cache regenerates as needed. Cached files are stored in Vite's `config.cacheDir` (usually `/node_modules/.vite`). | `true`      |
| `defaultImageOptions` | `TldrawImageOptions` | Default options object for all the image conversion process. See section below for more detail.                                                                                                                                                               | _See below_ |
| `verbose`             | `boolean`            | Log information about the conversion process to the console.                                                                                                                                                                                                  | `false`     |

### `TldrawImageOptions`

| Key           | Type             | Description                                                                                                                                      | Default |
| ------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| `darkMode`    | `boolean`        | Output a dark theme version of the image.                                                                                                        | `false` |
| `format`      | `"png" \| "svg"` | Output image format.                                                                                                                             | `"svg"` |
| `stripStyle`  | `boolean`        | Remove `<style>` elements from SVG output, useful to lighten the load of embedded fonts or if you are providing your own stylesheet for the SVG. | `false` |
| `transparent` | `boolean`        | Output image with a transparent background.                                                                                                      | `false` |

### Plugin options example

Configure the plugin to always generate PNGs with a transparent background, and to log conversion details:

```ts
// vite.config.ts
import tldraw from '@kitschpatrol/vite-plugin-tldraw'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    tldraw({
      verbose: true,
      format: 'png',
      transparent: true,
    }),
  ],
})
```

The `@kitschpatrol/vite-plugin-tldraw` also exports `TldrawPluginOptions` and `TldrawImageOptions` types for your convenience.

## Import path options

Import directives may include query parameters to set image conversion options on a per-import basis.

Query parameters take precedence over `TldrawPluginOptions` set at plugin instantiation in your `vite.config.ts`.

_Note: Due to [constraints in TypeScript's module declaration wildcards](https://github.com/microsoft/TypeScript/issues/38638), the import path must be suffixed with `&tldr` or `&tldraw` when query parameters are used._

### Additional query parameter options

In addition to all `TldrawImageOptions`, query parameters also accept a `frame` option:

| Key     | Type                  | Description                                                                                                                                                                              | Default     |
| ------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `frame` | `string \| undefined` | When defined, outputs only a specific frame from the `.tldr` file. Provide either the frame name or its shape ID, e.g. `Frame 1`. Slugified frame names will also match, e.g. `frame-1`. | `undefined` |

### Import path query parameter examples

```ts
// example.ts
import tldrImagePng from './assets/test-sketch.tldr?format=png&tldr'
import tldrImageTransparentPng from './assets/test-sketch.tldr?format=png&transparent=true&tldr'
import tldrImageFrame from './assets/test-sketch-three-frames.tldr?frame=frame-1&tldr'

// logs a png url
console.log(tldrImagePng)

// logs a transparent-background png url
console.log(tldrImageTransparentPng)

// logs an svg url for "Frame 1" in the source .tldr
console.log(tldrImageFrame)
```

## Implementation notes

This tool is not a part of the official tldraw project, and it is currently only tested and known to be compatible with tldraw 2.0.0-beta.2.

Behind the scenes, the plugin calls [@kitschpatrol/tldraw-cli](https://github.com/kitschpatrol/tldraw-cli)'s Node API to generate image files from `.tldr` files, and then passes the resulting URL as the value of the module import.

Because [`tldraw-cli`](https://github.com/kitschpatrol/tldraw-cli) relies on [Puppeteer](https://pptr.dev), conversion can be a bit slow (on the order of a second or two), so by default generated image assets are cached to expedite subsequent builds.

During development, images are served from the cache, and when Vite builds for production the image files are bundled into the output with a hashed filename to simplify cache busting.

## The future

Possible paths for future improvements include the following:

- Rollup cross-compatibility
- Support importing tldraw\.com URLs
- SVG compression, PNG resizing / optimization (or test integration with other asset pipeline plugins)

Any other suggestions are welcome.

I'm consciously releasing this tool under the `@kitschpatrol` namespace on NPM to leave the `vite-plugin-tldraw` package name available to the core tldraw project.

## References

Some links and issues from development are retained for my own reference below:

**TypeScript module query parameter compatibility:**

- <https://github.com/microsoft/TypeScript/issues/38638>
- <https://www.typescriptlang.org/docs/handbook/modules/reference.html#ambient-modules>
- <https://github.com/JonasKruckenberg/imagetools/issues/70>
- <https://github.com/JonasKruckenberg/imagetools/issues/160>

**Vite asset plugin approach:**

- <https://github.com/vitejs/vite/discussions/7515>
- <https://liana.one/custom-language-plugin-for-vite>
- <https://github.com/UstymUkhman/vite-plugin-glsl>

**Vite asset Path issues:**

- <https://github.com/vitejs/vite/issues/2394>
- <https://github.com/vitejs/vite/issues/1997>
