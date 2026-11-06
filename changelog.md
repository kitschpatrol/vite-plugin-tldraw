# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [6.0.3] - 2026-11-02

### Maintenance

- Update runtime requirements to `@kitschpatrol/tldraw-cli ^6.1.1` and `pretty-ms ^10.0.0`.
- Refresh development dependencies and pnpm to 12.16.1, replace the skill-sync prepare hook with native pnpm skill permissions, and clean up dependency build and release-age settings.
- Tighten release tag matching, validate tags against the repository's default branch, and refresh release actions.
- Move dependency automation to a monthly schedule, refresh CI actions, and make link checks tolerate empty input while excluding loopback URLs.

## [6.0.2] - 2026-10-06

### Documentation

- Correct padding guidance: omitting `padding` uses automatic trimming to the visual content bounds.

### Maintenance

- Refresh runtime dependencies to `@kitschpatrol/tldraw-cli ^6.1.0` and nanoid `^6.0.2`.
- Refresh shared configuration and pnpm, and add a prepare hook to synchronize dependency-provided development skills.
- Add a scheduled dependency-update workflow that runs the ksc-update skill.

## [6.0.1] - 2026-10-05

### Changed

- **Breaking:** Restrict supported Node.js versions to `^22.22.2 || ^24.0.0 || >=26.0.0`, excluding Node 23 and 25.

### Fixed

- Report an actionable error when conversion produces no output, including guidance to check requested page or frame selections.

### Documentation

- Document runtime, peer, and development requirements; correct global image-option nesting and page-selection guidance, and update cross-bundler guidance.

### Maintenance

- Refresh runtime dependencies, including `@kitschpatrol/tldraw-cli ^6.0.4`, nanoid 6, image-size, slugify, and log-formatting helpers.
- Upgrade contributor tooling to shared-config 8, TypeScript 6, Vitest 5, and pnpm 12; require `^24.16.0 || >=26.3.0` Node.js for development and simplify lint/build configuration.
- Add scheduled repository and homepage link checks and refresh pinned GitHub Actions.
- Rename the deep-clean script to `clean-deep` and switch local publishing back to one-time-password authentication.

## [6.0.0] - 2026-06-06

### Changed

- **Breaking:** Upgrade conversion to tldraw 5 through `@kitschpatrol/tldraw-cli ^6.0.0`, including its changed image-padding behavior.
- **Breaking:** Require Node.js 22.22.2 or newer, dropping Node 20 support.

### Documentation

- Update the MIT license link.

### Maintenance

- Refresh helper and development dependencies, migrate to pnpm 11 and its build-approval configuration, and update CI installation and publishing commands.

## [5.1.6] - 2026-04-27

### Added

- Add Vite 8 to the supported peer dependency range.

### Documentation

- Recommend migration to `@kitschpatrol/unplugin-tldraw` for broader bundler support and future feature development.
- Update contribution guidance and explain the repository's shared-config and mdat tooling.

### Maintenance

- Refresh runtime dependencies, including `@kitschpatrol/tldraw-cli ^5.0.16` and nanoid.
- Refresh development dependencies and make cleanup commands portable while preserving the local Claude configuration directory.
- Allow GitHub releases from version tags without a `v` prefix and simplify metadata checkout.

## [5.1.5] - 2026-04-07

### Fixed

- Normalize Windows input paths for conversion and use forward slashes in development image URLs.

### Maintenance

- Update `@kitschpatrol/tldraw-cli` to `^5.0.15`.
- Add Linux, macOS, and Windows CI for builds, linting, and Chromium browser tests; make tests run once and increase the browser-test timeout.
- Refresh contributor tooling to shared-config 7 with Node.js 22.18+ for development, enforce LF line endings, and tighten workflow permissions and credential handling.

## [5.1.4] - 2026-03-21

### Maintenance

- Refresh runtime dependencies, including `@kitschpatrol/tldraw-cli ^5.0.13` and nanoid.
- Enable publint package validation, update tsdown dependency settings, and mark the package as side-effect-free.
- Refresh contributor dependencies and editor settings, including migration to shared-config 6.
- Upgrade checkout and repository-metadata workflow actions.

## [5.1.3] - 2026-02-18

### Fixed

- Convert boolean and numeric import query values to their proper types so options such as `dark=false`, padding, and scale are passed correctly.
- Clear disabled caches once during configuration, tolerating a missing directory and avoiding deletion races between concurrent conversions.
- Reject unsupported `format=tldr` requests before conversion in both URL and metadata modes.
- Correct conversion-log prefixes to `[vite-plugin-tldraw]`.

### Maintenance

- Update `@kitschpatrol/tldraw-cli` to `^5.0.10`.
- Refresh development dependencies and adjust Knip's handling of the shared TypeScript configuration.

## [5.1.2] - 2026-01-29

### Maintenance

- Update `@kitschpatrol/tldraw-cli` to `^5.0.9`.
- Refresh development dependencies and editor integration, and migrate CSpell and Prettier configuration files to TypeScript.

## [5.1.1] - 2025-12-08

### Maintenance

- Update `@kitschpatrol/tldraw-cli` to `^5.0.6`.
- Fix contributor-tool hoisting by moving publicHoistPattern into pnpm-workspace.yaml, and refresh development dependencies.

## [5.1.0] - 2025-12-06

### Added

- Add `returnMetadata` to export `{ src, width, height, format }` objects instead of URL strings, with an exported `TldrawImageResultMetadata` type.
- Add the `/client` type-declaration entry point while retaining `/ext` as an alias.

### Changed

- **Breaking:** Widen `.tldr` import declarations from `string` to `string | TldrawImageResultMetadata`, requiring consumers to narrow the type before string-only use.

### Documentation

- Document metadata mode and `/client` typings, add a dark-mode example, and clarify tldraw format compatibility and cross-bundler plans.

### Maintenance

- Update `@kitschpatrol/tldraw-cli` to `^5.0.5`, declare conversion helpers as runtime dependencies, and declare Vite 2–7 as supported peers.
- Replace the esbuild and standalone declaration build with tsdown, copy client declarations into distribution output, and enable Are the Types Wrong checks.
- Add browser tests for static and variable dynamic imports and refresh development dependencies.

## [5.0.2] - 2025-11-05

### Maintenance

- Update `@kitschpatrol/tldraw-cli` to `^5.0.2`.
- Migrate tests to Vitest 4 with headless Playwright Chromium and a dedicated Vitest configuration; refresh Vite.

## [5.0.1] - 2025-11-04

### Maintenance

- Update `@kitschpatrol/tldraw-cli` to `^5.0.1`.
- Refresh development dependencies and editor settings, and configure token-based local npm publishing.

## [5.0.0] - 2025-09-28

### Changed

- **Breaking:** Upgrade conversion to tldraw 4 through `@kitschpatrol/tldraw-cli ^5.0.0`.
- **Breaking:** Raise the minimum supported Node.js version to 20.19.0.

### Maintenance

- Refresh development and bundled helper dependencies, including slugify 3, and switch lint scripts to the `ksc` CLI.

## [4.0.2] - 2025-09-01

### Fixed

- Reduce unwanted conversion logging through `@kitschpatrol/tldraw-cli ^4.7.1`.

### Maintenance

- Refresh Vite and pnpm, and move dependency build approvals into pnpm-workspace.yaml.

## [4.0.1] - 2025-09-01

### Maintenance

- Update `@kitschpatrol/tldraw-cli` to `^4.7.0`.
- Refresh development tooling, including Vite 7, TypeScript 5.9, and pnpm.

## [4.0.0] - 2025-08-15

### Changed

- **Breaking:** Prefix production asset URLs with Vite's configured `base` path.
- **Breaking:** Return development asset URLs with a leading slash instead of relative paths.

### Maintenance

- Refresh development and bundled helper dependencies.

## [3.0.5] - 2025-08-11

### Maintenance

- Update `@kitschpatrol/tldraw-cli` to `^4.6.43`.

## [3.0.4] - 2025-08-11

### Maintenance

- Update `@kitschpatrol/tldraw-cli` to `^4.6.42`.
- Refresh development dependencies and lint configuration, and update import-test snapshots for Vitest's cache-directory layout.
- Upgrade the repository-metadata action and simplify its workflow.

## [3.0.3] - 2025-05-08

### Maintenance

- Update `@kitschpatrol/tldraw-cli` to `^4.6.37`.
- Refresh contributor tooling and bundled helper dependencies, including pretty-bytes 7, and allow the unrs-resolver installation build.

## [3.0.2] - 2025-03-20

### Maintenance

- Update `@kitschpatrol/tldraw-cli` to `^4.6.34`.
- Refresh development and bundled helper dependencies, upgrade TypeScript to 5.8, and remove the eslint-plugin-markdown override.

## [3.0.1] - 2025-03-04

### Documentation

- Correct the repository URL in package metadata.

### Maintenance

- Refresh shared configuration and update Node.js typings to the Node 20 series.

## [3.0.0] - 2025-03-02

### Changed

- **Breaking:** Require Node.js 20.9.0 or newer, dropping Node 18 support.

### Documentation

- Update usage examples to reference repository test fixtures and add plugin API documentation.

### Maintenance

- Update `@kitschpatrol/tldraw-cli` to `^4.6.31`.
- Migrate to shared-config 5, flat ESLint configuration, shared TypeScript settings, and pnpm 10; refresh build and test tooling, including Vite 6 and Vitest 3.

## [2.3.8] - 2024-09-28

### Fixed

- Fix the dynamic require error through `@kitschpatrol/tldraw-cli ^4.6.19`.

### Maintenance

- Refresh shared configuration, build and release dependencies, Vite, and pnpm.

## [2.3.7] - 2024-09-14

### Maintenance

- Update `@kitschpatrol/tldraw-cli` to `^4.6.16`.
- Refresh shared configuration and adjust release-script command invocation.

## [2.3.6] - 2024-09-14

### Maintenance

- Update `@kitschpatrol/tldraw-cli` to `^4.6.15`.
- Refresh development dependencies and pnpm, align Node.js typings with Node 18, and revise the cleanup script.

## [2.3.5] - 2024-09-07

### Fixed

- Restore package-root TypeScript declarations by aligning the source and build entry point with `dist/index.d.ts`.

## [2.3.4] - 2024-09-07

### Maintenance

- Replace the manual demo with Vitest import tests covering image options, pages, and frames.
- Update `@kitschpatrol/tldraw-cli` to `^4.6.13`.
- Refresh development and bundled helper dependencies, require pnpm 9+ for contributors, and revise build, cleanup, and release scripts.
- Switch release and metadata workflows to maintained action forks and allow manual metadata synchronization.

## [2.3.3] - 2024-05-07

### Fixed

- Restore compatibility with newer `.tldr` files through `@kitschpatrol/tldraw-cli ^4.5.3`.

### Maintenance

- Refresh development dependencies, adopt pnpm 9, and add a cache-clearing script.

## [2.3.2] - 2024-04-15

### Fixed

- Restore conversion compatibility with newer tldraw\.com `.tldr` files through `@kitschpatrol/tldraw-cli ^4.5.2`.

### Maintenance

- Refresh TypeScript, Node.js typings, and pnpm.

## [2.3.1] - 2024-04-08

### Maintenance

- Update `@kitschpatrol/tldraw-cli` to `^4.5.1`.
- Refresh shared configuration, Node.js typings, and the bundled nanoid dependency.

## [2.3.0] - 2024-04-05

### Added

- Add a `page` import query parameter for selecting a page by name or ID, optionally combined with frame selection.

### Documentation

- Document page selection and add multi-page and page-with-frame demo examples.

### Maintenance

- Update `@kitschpatrol/tldraw-cli` to `^4.4.0` and refresh development dependencies and pnpm.

## [2.2.1] - 2024-03-28

### Documentation

- Simplify README navigation by removing the table of contents.

### Maintenance

- Update `@kitschpatrol/tldraw-cli` to `^4.3.2`.
- Refresh development dependencies, shared configuration, and pnpm.

## [2.2.0] - 2024-03-17

### Added

- Add `padding` and raster `scale` options to global image defaults and import queries through `@kitschpatrol/tldraw-cli ^4.3.1`.

### Documentation

- Document padding and scale defaults and demonstrate both options in the demo.

## [2.1.0] - 2024-03-16

### Maintenance

- Update `@kitschpatrol/tldraw-cli` to `^4.2.0`.
- Refresh development dependencies and pin the contributor package manager to pnpm 8.15.4.
- Add automatic repository-metadata synchronization from package.json and refresh release workflow actions.

## [2.0.0] - 2024-02-23

### Changed

- **Breaking:** Rename `darkMode` to `dark` in import query parameters and `TldrawImageOptions`.

### Documentation

- Document the `dark` option and expand README navigation, project information, and contribution guidance.

### Maintenance

- Update `@kitschpatrol/tldraw-cli` to `^4.1.2`.
- Refresh development dependencies and shared configuration, and introduce mdat-generated README sections.

## [1.0.4] - 2024-01-20

### Changed

- Expand verbose logging with cache hits and misses, output file sizes, and human-readable conversion times.

### Fixed

- Ignore undefined plugin options instead of allowing them to overwrite defaults.

### Documentation

- Clarify plugin configuration, cache behavior, and usage examples.

### Maintenance

- Replace deprecated recursive `fs.rmdir` calls with `fs.rm` for cache cleanup.
- Upgrade to `@kitschpatrol/tldraw-cli ^3.2.0`, adapt to its array-based conversion results, and refresh Vite and logging dependencies.

## [1.0.3] - 2024-01-18

### Documentation

- Correct package metadata links for the repository, homepage, and issue tracker.

## [1.0.2] - 2024-01-18

### Documentation

- Correct the triple-slash type reference to `@kitschpatrol/vite-plugin-tldraw/ext`.

## [1.0.1] - 2024-01-18

### Documentation

- Correct the installation command, package imports, and TypeScript configuration; clarify tested tldraw compatibility and the relationship to tldraw-cli.

### Maintenance

- Update `@kitschpatrol/tldraw-cli` to `^2.2.3`.

## [1.0.0] - 2024-01-18

### Added

- Convert local `.tldr` imports into SVG or PNG asset URLs, serving cached images during development and emitting hashed assets for production builds.
- Expose global image defaults and per-import query options for format, dark mode, transparency, SVG style removal, and individual frame selection.
- Cache conversions using source-content and option hashes, with configurable caching and verbose conversion logs.
- Ship an ESM package for Node.js 18+ with the default `tldraw` plugin factory, exported option types, and `/ext` declarations for `.tldr` imports and query suffixes.

### Documentation

- Provide installation, Vite configuration, TypeScript setup, and conversion-option guides, plus a runnable demo with sample sketches.

### Maintenance

- Establish TypeScript declaration generation, esbuild packaging, shared lint configuration, and npm/GitHub release tooling.

[1.0.0]: https://github.com/kitschpatrol/vite-plugin-tldraw/releases/tag/v1.0.0
[1.0.1]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v1.0.0...v1.0.1
[1.0.2]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v1.0.1...v1.0.2
[1.0.3]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v1.0.2...v1.0.3
[1.0.4]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v1.0.3...v1.0.4
[2.0.0]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v1.0.4...v2.0.0
[2.1.0]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v2.0.0...v2.1.0
[2.2.0]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v2.1.0...v2.2.0
[2.2.1]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v2.2.0...v2.2.1
[2.3.0]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v2.2.1...v2.3.0
[2.3.1]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v2.3.0...v2.3.1
[2.3.2]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v2.3.1...v2.3.2
[2.3.3]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v2.3.2...v2.3.3
[2.3.4]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v2.3.3...v2.3.4
[2.3.5]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v2.3.4...v2.3.5
[2.3.6]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v2.3.5...v2.3.6
[2.3.7]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v2.3.6...v2.3.7
[2.3.8]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v2.3.7...v2.3.8
[3.0.0]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v2.3.8...v3.0.0
[3.0.1]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v3.0.0...v3.0.1
[3.0.2]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v3.0.1...v3.0.2
[3.0.3]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v3.0.2...v3.0.3
[3.0.4]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v3.0.3...v3.0.4
[3.0.5]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v3.0.4...v3.0.5
[4.0.0]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v3.0.5...v4.0.0
[4.0.1]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v4.0.0...v4.0.1
[4.0.2]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v4.0.1...v4.0.2
[5.0.0]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v4.0.2...v5.0.0
[5.0.1]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v5.0.0...v5.0.1
[5.0.2]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v5.0.1...v5.0.2
[5.1.0]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v5.0.2...v5.1.0
[5.1.1]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v5.1.0...v5.1.1
[5.1.2]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v5.1.1...v5.1.2
[5.1.3]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v5.1.2...v5.1.3
[5.1.4]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v5.1.3...v5.1.4
[5.1.5]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v5.1.4...v5.1.5
[5.1.6]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v5.1.5...v5.1.6
[6.0.0]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v5.1.6...v6.0.0
[6.0.1]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v6.0.0...v6.0.1
[6.0.2]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v6.0.1...v6.0.2
[6.0.3]: https://github.com/kitschpatrol/vite-plugin-tldraw/compare/v6.0.2...v6.0.3
