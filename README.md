# MMM-FF-code-injector

[![ISC License](https://img.shields.io/badge/license-ISC-blue.svg)](https://choosealicense.com/licenses/isc)

A headless module for [MagicMirror²](https://github.com/MichMich/MagicMirror) that runs code provided in config.js.

## Installation

Just navigate to the `modules` directory of your MagicMirror² installation and clone this repository.

```sh
git clone https://github.com/shin10/MMM-FF-code-injector.git
```

## Configuration

### Examples:

**Defaults:**

```js
{
  module: "MMM-FF-code-injector",
  config: {
    ignoreEventsIfSuspended: false,
    scripts: {
      START: null,
      SUSPEND: null,
      RESUME: null,
      CODE_INJECTOR_EXEC: null,
      intervals: []
    },
    additionalScripts: [],
    additionalStyles: [],
    events: {
      CODE_INJECTOR_EXEC: "CODE_INJECTOR_EXEC"
    }
  }
},
```

---

**Remap an event:**

```js
{
  module: "MMM-FF-code-injector",
  config: {
    scripts: {
      CODE_INJECTOR_EXEC:  {
        func: () => { Log.warn("random article event triggered") },
        args: [],
      },
    },
    events: {
      ARTICLE_RANDOM: "CODE_INJECTOR_EXEC"
    }
  }
},
```

---

**Run a function every 5 seconds, if the module is "visible":**

```js
{
  module: "MMM-FF-code-injector",
  config: {
    ignoreEventsIfSuspended: false,
    position: "top",
    scripts: {
      intervals: [
        {
          interval: 5000,
          description: "Testinterval",
          ignoreIfSuspended: true,
          func: function(a, b) {
            Log.warn("FOO");
            Log.warn(a, b);
            Log.warn(this.config);
          },
          args: ["BAR", 842]
        }
      ]
    },
  },
},
```

---

**Rotate the screen on init, if the client has the user-agent includes `Electron`:**

```js
{
  module: "MMM-FF-code-injector",
  config: {
    scripts: {
      START: {
        ignoreIfSuspended: false,
        func: () => { document.getElementsByTagName('html')[0].setAttribute('data-useragent', window.navigator.userAgent) },
        args: [],
      },
    },
    additionalStyles: ['css/electron.css'],
  },
},
```

_electron.css_

```css
html[data-useragent*="Electron"] {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  -ms-touch-action: none;
  touch-action: none;
}

html[data-useragent*="Electron"] body {
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -webkit-transform: rotate3d(0, 0, 1, -90deg);
  transform: rotate3d(0, 0, 1, -90deg);
  margin: var(--gap-body-top) var(--gap-body-right) var(--gap-body-bottom) var(
      --gap-body-left
    );
  position: absolute;
  top: calc(100% - var(--gap-body-right) - var(--gap-body-left));
  left: 0;
  height: calc(100vw - var(--gap-body-right) - var(--gap-body-left));
  width: calc(100vh - var(--gap-body-top) - var(--gap-body-bottom));
}
```

### Events

The following module events are supported:

- START
- SUSPEND
- RESUME

To call a function from another module, you can use:

- CODE_INJECTOR_EXEC

For ease of use this event can be remapped in the `events` object to custom strings. Refer to the example above.
