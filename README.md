<h1 align="center">BarTime</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/node-%3E%3D8.0.0-blue.svg" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> A visual progress bar style countdown timer to your Touch Bar via BetterTouchTool. 

![](images/set_timer.gif)

## Prerequisites

- node >=8.0.0
- BetterTouchTool > 2.430

## Install

### BetterTouchTool

BetterTouchTool is a paid app available for purchase on its [website](https://folivora.ai/), or through a [Setapp](https://setapp.com/) subscription. 

Enable external scripting through Preferences -> Scripting BTT.

![](images/btt_scripting.png)

Download BarTime's BTT presets and install them. 

- [Touch Bar Preset](https://github.com/pnlng/bartime/releases/latest/download/BarTime.bttpreset)
- [Named Trigger Preset](https://github.com/pnlng/bartime/releases/latest/download/BarTime_long_press.bttpreset)

### BarTime Server

Clone or [download](https://github.com/kefranabg/readme-md-generator/archive/master.zip) the project. In the directory, run

```sh
# npm
npm install
# OR yarn
yarn install
```

Then start the server. 

```sh
make serve
```

#### Daemon & Login Item

You may want to run BarTime as a daemon. In that case, you could use 

```sh
make demon
```

There are a few ways to launch the above script at login. 

- [Native solutions](https://stackoverflow.com/questions/6442364/running-script-upon-login-mac) as discussed on Stack Overflow (Automator, `launchd`, etc)
- Paid third-party apps:
  - [Keyboard Maestro](https://www.keyboardmaestro.com/main/)
  - [Lingon](https://www.peterborgapps.com/lingon/)

## Usage and Configuration

To hook up the BTT widget and the server, copy the main widget's UUID. 

![](images/uuid.png)

Then go to 

```
http://localhost:4975/bartime/config/set?uuid=YOUR_UUID
```

Things should be ready to go!

Using the time picker widget to set a timer:

![](images/set_timer.gif)

Using the bar widget to start a timer of default length (15m). 

![](images/use_default.gif)

For the bar widget, the following actions are available. 

- **Tap**
  - start default timer, if idle
  - pause/resume, if a timer is set
- **Long press**
  - stop current timer

## Acknowledgements

BarTime took inspirations from the following projects. 

- [Timebar](https://www.macupdate.com/app/mac/47506/timebar): Turn your menubar into a subtle timer.
  - Unfortunately it's been many years since Timebar was last maintained/available. I still miss the app dearly. This is *the* reason I wrote BarTime.
- [ng-vu/tomato](https://github.com/ng-vu/tomato): Tomato is a command for running pomodoro in background. It's designed mainly to stay in MacBook touchbar.
- [mathiasvr/tiny-timer](https://github.com/mathiasvr/tiny-timer): :clock2: Small countdown timer and stopwatch module.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_