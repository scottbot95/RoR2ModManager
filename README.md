[![Angular Logo](https://www.vectorlogo.zone/logos/angular/angular-icon.svg)](https://angular.io/) [![Electron Logo](https://www.vectorlogo.zone/logos/electronjs/electronjs-icon.svg)](https://electronjs.org/)

[![Travis Build Status][build-badge]][build]
[![Code Coverage Status][codecov-badge]][codecov]
[![Make a pull request][prs-badge]][prs]
[![License](http://img.shields.io/badge/Licence-MIT-brightgreen.svg)](LICENSE.md)

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]

# Introduction

A simple mod manager for Risk of Rain 2 build using Angular and Electron.

## Features

- Browse all mods available from thunderstore.io
- Handles the install button on thunderstore.io
    - Currently it just marks package for install
    - You then have to click apply for install the mod
- Install and uninstall selected mods
    - Also installs all necessary dependencies
- Update mods (should work but has yet to be tested)
- Very primative import/export system
    - Many improvements to come
- Open various useful folder from menu
- Open config file for (some) installed packages
- Download updates automatically in the background and apply them on restart
- Internal config editor for installed mods

## Getting Started

Simply download and install the latest version found on the [releases](https://github.com/scottbot95/RoR2ModManager/releases) page to get started.

From there, simply select which mods you would like to install (dependencies will be automatically selected for you) and click 'Apply'.
It won't seem like it's doing anything, but don't worry, it will begin downloading and
installing your selected mods shortly. (I'm working on a progress screen)

![screenshot](https://i.imgur.com/CLMXyly.png)

[build-badge]: https://travis-ci.org/scottbot95/RoR2ModManager.svg?branch=master
[build]: https://travis-ci.org/scottbot95/RoR2ModManager
[license-badge]: https://img.shields.io/badge/license-Apache2-blue.svg?style=flat
[license]: https://github.com/scottbot95/RoR2ModManager/blob/master/LICENSE.md
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[github-watch-badge]: https://img.shields.io/github/watchers/scottbot95/RoR2ModManager.svg?style=social
[github-watch]: https://github.com/scottbot95/RoR2ModManager/watchers
[github-star-badge]: https://img.shields.io/github/stars/scottbot95/RoR2ModManager.svg?style=social
[github-star]: https://github.com/scottbot95/RoR2ModManager/stargazers
[codecov-badge]: https://codecov.io/gh/scottbot95/RoR2ModManager/branch/master/graph/badge.svg
[codecov]: https://codecov.io/gh/scottbot95/RoR2ModManager

# For Developers

## To build for development

- **in a terminal window** -> yarn start

Voila! You can use your Angular + Electron app in a local development environment with hot reload !

The application code is managed by `main.ts`. In this sample, the app runs with a simple Angular App (http://localhost:4200) and an Electron window.
The Angular component contains an example of Electron and NodeJS native lib import.

## Included Commands

| Command                 | Description                                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| `yarn ng:serve:web`     | Execute the app in the browser                                                                              |
| `yarn build`            | Build the app. Your built files are in the /dist folder.                                                    |
| `yarn build:prod`       | Build the app with Angular aot. Your built files are in the /dist folder.                                   |
| `yarn electron:local`   | Builds your application and start electron                                                                  |
| `yarn electron:linux`   | Builds your application and creates an app consumable on linux system                                       |
| `yarn electron:windows` | On a Windows OS, builds your application and creates an app consumable in windows 32/64 bit systems         |
| `yarn electron:mac`     | On a MAC OS, builds your application and generates a `.app` file of your application that can be run on Mac |

**Your application is optimised. Only /dist folder and node dependencies are included in the executable.**
