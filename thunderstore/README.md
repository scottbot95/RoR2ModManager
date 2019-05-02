[![Travis Build Status][build-badge]][build]

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

## Getting Started

Simply download and install the latest version found on the [releases](https://github.com/scottbot95/RoR2ModManager/releases) page to get started.

From there, simply select which mods you would like to install (dependencies will be automatically selected for you) and click 'Apply'.
It won't seem like it's doing anything, but don't worry, it will begin downloading and
installing your selected mods shortly. (I'm working on a progross screen)

[build-badge]: https://travis-ci.org/scottbot95/RoR2ModManager.svg?branch=master
[build]: https://travis-ci.org/scottbot95/RoR2ModManager
[github-watch-badge]: https://img.shields.io/github/watchers/scottbot95/RoR2ModManager.svg?style=social
[github-watch]: https://github.com/scottbot95/RoR2ModManager/watchers
[github-star-badge]: https://img.shields.io/github/stars/scottbot95/RoR2ModManager.svg?style=social
[github-star]: https://github.com/scottbot95/RoR2ModManager/stargazers

![screenshot](https://i.imgur.com/UDCkkUn.png)
