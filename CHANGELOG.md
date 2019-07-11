# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Attempted to switch profiles will now drag you to the packages page from whatever page you were on
- 'Dirty' package rows (rows needing (un)install) are now more distinctive

### Fixed

- Default RoR2 install path was missing a space
- If `Humanized Package Names` is enabled, filter will now work properly

## [1.0.1] 2019-07-03

### Changed

- Will now also install config files found in mod archive

## [1.0.0] 2019-05-22

### Added

- Ability to select which version of a package you wish to install
- Fancy new changes progress log
- Close button to Package Details pane
- Serveral improvements to profile system
    - **Now supports multiple named profiles and easy switch between them**
    - Renaming profiles
    - Streamlined import/export process
    - Backend improvements to profile management system

### Changed

- Complete rework of dialog system (Most noticably this will increase load time of dialogs)
- Uninstalling BepInExPack will no longer remove your config files

### Fixed

- Bug preventing mod manager from updating BepInExPack
- Properly handles thunderstore install button again

## [0.7.0] 2019-05-14

### Changed

- Added a multi-step workflow for applying changes
- Updated some error messages

## [0.6.4] 2019-05-09

### Fixed

- Fix import/export dialog not showing

## [0.6.3] 2019-05-09

### Added

- Checks for updates to mod manager on a confiurable interval

### Fixed

- List of available sometimes wouldn't finish loading (see [#71](https://github.com/scottbot95/RoR2ModManager/issues/71))
- Unnecessarily showing error message on start

## [0.6.2] 2019-05-08

### Fixed

- Fixed installer not saving RoR2 install path correctly.
    - Should fix issue where you needed to change path from in the app for it to work

## [0.6.1] 2019-05-08

### Fixed

- App was still using old icon

## [0.6.0] 2019-05-08

### Added

- New config editor page
    - Added right click option to jump to config
- Finally have an icon!

## [0.5.1] 2019-05-04

### Added

- Right click on table header to select visible columns
    - Added some extra columns for your viewing pleasure
- Mod manager will now download updates automatically

## [0.4.2] 2019-05-02

### Fixed

- Fixed markdown formating for thunderstore parser

## [0.4.1] 2019-05-02

### Changed

- Updated screenshot to most recent version
- Update Readme

## [0.4.0] 2019-05-02

### Added

- About page
- Import/Export package profile menu items
- Menu items to open various useful folders
- Package icons to table and details views
- Context menu to installed packages with option to open config file

### Changed

- Completely rewrote download manager code, should work much better now

## [0.3.1] 2019-04-28

### Fixed

- Properly register URI handler on windows
- Installer remembers Risk of Rain 2 install path
- Package table is full width until a package is selected for details

## [0.3.0] 2019-04-28

### Added

- Simple handling of the install button on thunderstore.io
  - For it opens details and marks package for install
  - NOTE: So far only tested on linux

### Fixed

- Sidenav switches to always visible mode in xsmall window sizes

## [0.2.0] 2019-04-27

### Added

- Filter box now has a clear button
- Verify RoR2 Install path during setup
  - This used to only happen on preferences page
- Remember previously installed packages accross app restarts

## [0.1.1] 2019-04-26

### Fixed

- Fixed several dependency issues with electron-builder

## [0.1.0] 2019-04-25

- Initial alpha release

[unreleased]: https://github.com/scottbot95/RoR2ModManager/compare/v1.0.1...HEAD
[unreleased]: https://github.com/scottbot95/RoR2ModManager/compare/v1.0.0...1.0.1
[1.0.0]: https://github.com/scottbot95/RoR2ModManager/compare/v0.7.0...v1.0.0
[0.7.0]: https://github.com/scottbot95/RoR2ModManager/compare/v0.6.4...v0.7.0
[0.6.4]: https://github.com/scottbot95/RoR2ModManager/compare/v0.6.3...v0.6.4
[0.6.3]: https://github.com/scottbot95/RoR2ModManager/compare/v0.6.2...v0.6.3
[0.6.2]: https://github.com/scottbot95/RoR2ModManager/compare/v0.6.1...v0.6.2
[0.6.1]: https://github.com/scottbot95/RoR2ModManager/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/scottbot95/RoR2ModManager/compare/v0.5.1...v0.6.0
[0.5.1]: https://github.com/scottbot95/RoR2ModManager/compare/v0.4.1...v0.5.1
[0.4.1]: https://github.com/scottbot95/RoR2ModManager/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/scottbot95/RoR2ModManager/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/scottbot95/RoR2ModManager/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/scottbot95/RoR2ModManager/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/scottbot95/RoR2ModManager/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/scottbot95/RoR2ModManager/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/scottbot95/RoR2ModManager/releases/tag/v0.1.0
