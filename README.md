<a name="readme-top"></a>

<h1 align="center">
  <br>
  <img src="./img/logo-name.png"/>
</h1>

<h4 align="center">A web app for designing solar system installs built on top of <a href="https://angular.io/" target="_blank">Angular</a>.</h4>


<p align="center">
</p>

<p align="center">
  <a href="#how-to-use">How To Use</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#release-history">Release History</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>
<p align="center">
<img src="./img/solar-engineer-v3.gif" width="80%"/>
</p>


## How To Use

Visit <a href="https://solarengineer.app/" target="_blank">SolarEngineer.App</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Key Features


* Panels
  - Click to create
  - Alt click drag to multi select
  - Alt click drag in create mode to multi create
  - Create String with selected
  <!-- -  -->
* Strings
  - View string stats next to selected string
  - Link panels in link mode
  - View links with line graphics
* Options
  - Change key bindings
  - Toggle graphics settings

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Release History

### 1.0.6 - <span style="font-size: smaller;">21/06/2023</span>
**New Features:**
- Redesigned context menus.
- Redesigned the desktop toolbar to include all action buttons from the mobile version.
- Mobile users can now create panel links without any glitches.
- Introduced a new side action bar for mobile users.
- Enabled mobile controls for moving panels, selecting, and multi-selecting.
- Moved the settings dialog to the side UI for mobile users.

**Bug Fixes:**
- Fixed a bug where panel link lines mapped to random panels.
- Panel links are now saved to the database and can update in real-time over SignalR.

### 1.0.5 - <span style="font-size: smaller;">19/06/2023</span>
**New Features:**
- Improved project management in the side UI, allowing users to edit projects on desktop and mobile.
- Implemented new user profile cards when tapping on the preview.
- Enhanced dialogs, side UI data view animations, and introduced SVG animations.
- Provided a different view for mobile in the projects side UI, now featuring a right-to-left animation for changing pages.
- Client now saves all friend connections and can see when users come online or go offline.
- Improved mobile UI for the side UI nav bar.
- Added custom dialogs for mobile screens.

**Bug Fixes:**
- Fixed the issue where an undefined string was not created on project creation.
- Sorted the projects list by last updated, updating the "last updated" field for every item create, update, or delete.
- Improved notifications for mobile devices.

### 1.0.4 - <span style="font-size: smaller;">14/06/2023</span>
**New Features:**
- Added MessagePack to SignalR and included more options in the projects side menu.
- Enabled adding users to projects from the context menu. Built a reusable context menu component to streamline the process.
- Implemented the ability to invite friends to projects.
- Developed friend requests and notifications UI.
- Enabled accepting friend requests, viewing friends in the side menu, and improved notifications.
- Enabled sending friend requests and receiving notifications on the recipient side.
- Introduced notifications feature.
- Implemented search box querying for users and receiving responses via SignalR. Added a new users store.
- Added sign-in with GitHub.

**Bug Fixes:**
- Fixed the issue where an undefined string was not created on project creation.
- Redesigned Nginx proxy.

### 1.0.3 - <span style="font-size: smaller;">08/06/2023</span>
**New Features:**
- Added effects for when other SignalR users make an action, updating both displays.

### 1.0.2 - <span style="font-size: smaller;">07/06/2023</span>
**New Features:**
- Added SignalR for real-time updates between users.
- Added Google Sign in.

**API Changes:**
- Added a new `PanelLink` model to the API.

### 1.0.1 - <span style="font-size: smaller;">01/06/2023</span>
**New Features:**
- Added Link mode when string is selected.
- New menu options.
- Change graphics settings for canvas.
- Able to edit keybindings for app.

### 1.0.0 - <span style="font-size: smaller;">20/05/2023</span>
**New Features:**
- Create panels.
- Create strings.
- Switch between select and create mode.
- Multi create dragging in create mode.
- Multi select dragging in select mode.
- Zooming in and out.
- Dragging screen position.
- Moving panels.
- Rotating panels.
- Moving multiple panels while selected.
- Rotating multiple panels while selected.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ROADMAP -->
## Roadmap

- [x] Add Changelog
- [x] Add in multiple panel dragging and rotation
- [x] Add in settings menu
    - [x] Add change graphics settings
    - [x] Add edit keybinds
- [ ] Add in UI for mobile
    - [ ] Add all actions in mobile menu for doing everything you can do with a mouse and keyboard
- [ ] More strings edit functionality
    - [ ] Open a dialog to display string settings
    - [ ] Option to change string colour
    - [ ] Edit string name
- [ ] More panels edit functionality
    - [ ] Edit panel config
    - [ ] Change panel data values that will change the total string stats
- [ ] Implement backend for app
    - [ ] Add auth
    - [ ] Add save/load
    - [ ] Add share projects with other users
    - [ ] Multiple users on the same project at the same time via signalr

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Credits

This software uses the following open source packages:

- [Angular](https://angular.io/)
- [Nx](https://nx.dev/)
- [Ngrx](https://ngrx.io/)
- [Tailwind](https://tailwindcss.com/)
- [.Net](https://dotnet.microsoft.com/en-us/)
<!-- - [![Angular][Angular.io]][Angular-url] -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the Apache License. See LICENSE for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

> [solarengineer.app](https://solarengineer.app) &nbsp;&middot;&nbsp;
> GitHub [@hazzajenko](https://github.com/Hazzajenko) &nbsp;&middot;&nbsp;

[contributors-shield]: https://img.shields.io/github/contributors/hazzajenko/solar-engineer.svg?style=for-the-badge
[contributors-url]: https://github.com/hazzajenko/solar-engineer/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/hazzajenko/solar-engineer.svg?style=for-the-badge
[forks-url]: https://github.com/hazzajenko/solar-engineer/network/members
[stars-shield]: https://img.shields.io/github/stars/hazzajenko/solar-engineer.svg?style=for-the-badge
[stars-url]: https://github.com/hazzajenko/solar-engineer/stargazers
[issues-shield]: https://img.shields.io/github/issues/hazzajenko/solar-engineer.svg?style=for-the-badge
[issues-url]: https://github.com/hazzajenko/solar-engineer/issues
[license-shield]: https://img.shields.io/github/license/hazzajenko/solar-engineer.svg?style=for-the-badge
[license-url]: https://github.com/hazzajenko/solar-engineer/blob/master/LICENSE.txt
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
