# AutoCapture.js

A javascript library to capture every user interactions, it provides an easiest and most comprehensive way to
automatically capture the user interactions on the website, from the moment of installation forward. A single snippet
grabs every click, touch, select, and fill — forever.

This library is build with extensibility in mind, it is easy to extend and customize to fit your needs with the help of
the plugin system.


## Features

- Automatically captures every user interactions, such as
  - Tap
    - Click
    - Touch
    - Double Tap
    - Right Click
  - Form
    - Input
    - Select
    - Change
    - Submit
    - Reset
  - Scroll
  - Mouse Movement
  - Swipe
  - Page
    - Load
    - Unload
    - Change
  - Video
    - Play
    - Pause
    - End
    - Seek
    - Volume Change
- Build-in Plugins
  - [x] **Tap** - Capture the tap related events [(Source)](./src/plugins/plugin.tap.ts)
  - [x] **Scroll** - Capture the scroll event [(Source)](./src/plugins/plugin.scroll.ts)
  - [x] **Mouse Movement** - Capture the mouse movement [(Source)](./src/plugins/plugin.mouse-movement.ts)
  - [x] **Page** - Capture the page related events [(Source)](./src/plugins/plugin.page.ts)
  - [x] **Video** - Capture the video related events [(Source)](./src/plugins/plugin.video.ts)
  - [x] **Form** - Capture the form related events [(Source)](./src/plugins/plugin.form.ts)
  - [x] **Swipe** - Capture the swipe related events [(Source)](./src/plugins/plugin.swipe.ts)
- Extendable with custom plugins
- Lightweight and easy to use

## Use Cases

- **User Behavior Analysis** - Understand how users interact with your site, and how they use your site to achieve their
  goals.
- **Track User Journeys** - Track the user journeys from the moment they land on your site, to the moment they leave.
- **Custom Analytics Tool** - Build your own analytics tools and libraries using AutoCapture.js to track user behavior,
  and use the data to improve your site. e.g. Heatmap, Session Replay, etc.

## Live Demo
[autocapture-js.vercel.app](https://autocapture-js.vercel.app)

## Installation
AutoCapture.js is still in development, right now it is in the alpha stage, and it is not ready for production use.

### NPM

```bash
npm install autocapture
```

### CDN

```html

<script src='https://unpkg.com/autocapture.js'></script>
```

### Importing library

You can import the library in your project using the following:

```javascript
import { AutoCapture } from 'autoCapture';
```

And to install internal plugins, you can import the plugins in your project using the following:

```javascript
import { ScrollPlugin, MouseMovementPlugin, PageViewPlugin } from 'autoCapture';

AutoCapture.use(new ScrollPlugin());
AutoCapture.use(new MouseMovementPlugin());
AutoCapture.use(new PageViewPlugin());
```

However, you can use CDN to import the library's UMD build in a browser and start using it right away.

Note that the UMD build includes all the plugins, and you don't need to install them separately.

```html

<script src='https://unpkg.com/autocapture.js'></script>
```

### Usage

Using AutoCapture.js is very simple, now you just need to initialize the library with your preferred options.

```javascript
 const instance = new AutoCapture({
  safelist: ['input[type="password"]'],
  persistence: 'memory',
  capture: ['tap', 'form', 'page'],
  onEventCapture: (event) => {
    console.log('Event stored', event)

    // Send event to the server
    // ...
  }
})

instance.start()
```

**Simple as that** - AutoCapture.js will automatically capture all the user interactions on your site, from the moment
of installation forward.

### Notable Control Options

- **Safelist** - Safelist is a list of CSS selectors that you want to ignore. For example, you can ignore all the
  password inputs by adding `input[type="password"]` to the safelist.
- **Persistence** - Persistence is the way you want to store the captured events. You can choose between `memory`
  , `localStorage`, `sessionStorage` and `none`. `memory` is the default value.
  - `memory` - Events are stored in memory and are lost when the page is refreshed.
  - `localStorage` - Events are stored in the browser's local storage and are persisted across sessions.
  - `sessionStorage` - Events are stored in the browser's session storage and are lost when the browser is closed.
  - `none` - Events are not stored anywhere.
- **Capture** - Capture is the list of plugin name. You can choose between `tap`, `scroll`, `mouse-movement`, `page`
  , `video`, `form`, `swipe`. `tap`. But make sure you have installed the plugins you want to use.
- **onEventCapture** - onEventCapture is a callback function that will be called every time an event is captured. You
  can use this callback to send the captured events to your server.
  - You can use this callback to send the captured events to your server.
  - You can use this callback to persist the captured events in your own way.
  - You can use this callback to send the captured events to your own analytics tool.

## Complete Options List

See the [Options](./types/base.d.ts) interface for the complete list of options.

| Option | Type     | Default                                                                                                               | Description                                                                                                                                                                |
| --- |----------|-----------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| safelist | Array    | []                                                                                                                    | Safelist is a list of CSS selectors that you want to ignore. For example, you can ignore all the password inputs by adding `input[type="password"]` to the safelist.       |
| persistence | String   | 'memory'                                                                                                              | Persistence is the way you want to store the captured events. You can choose between `memory`, `localStorage`, `sessionStorage` and `none`. `memory` is the default value. |
| capture | Array    | ['tap', 'form', 'page']                                                                                               | A list of plugins to use. Defaults to `['tap', 'form', 'page']`.                                                                                                           |
| onEventCapture | Function | (capturedEvent: any) => {}                                                                                            | onEventCapture is a callback function that will be called every time an event is captured. You can use this callback to send the captured events to your server.           |
| elements | Array    | ['a', 'button', 'form', 'input', 'select', 'textarea', 'label']                                                       | A list of elements to capture events from.                                                                                                                                 |
| attributes | Array    | ['text', 'className', 'value', 'type', 'tagName', 'href', 'src', 'id', 'name', 'placeholder', 'title', 'alt', 'role'] | A list of attributes to capture from the elements.                                                                                                                         |
| sessionId | String   | ''                                                                                                                    | Custom session id, you can provide your own visitor id to track the user or use the auto generated one as a default.                                                       |
| payload | Object   | {}                                                                                                                    | Custom payload to be sent with each event.                                                     |
| maxEvents | Number   | 100                                                                                                                   | Specify the maximum number of events to store in the memory, local storage, or session storage and when the limit is reached, the oldest event will be removed.                                                    |
| maskTextContent | Boolean  | false                                                                                                                 | Specify if you want to mask the text content of the elements.                                                   |

## Available Public Methods

| Method | Description                                            |
| --- |--------------------------------------------------------|
| start | Start capturing events.                                |
| stop | Stop capturing events.                                 |
| clearCapturedEvents | Clear all the captured events from storage.            |
| getCapturedEvents | Get all the captured events.                           |
| unregisterPlugin | To unregister the installed plugins from the instance. |

## Sample Captured Events

```json
{
  "event": "click",
  "timestamp": "2022-11-03T19:04:22.538Z",
  "target": {
    "selector": "button",
    "attributes": {
      "text": "Click Me",
      "className": "btn btn-primary",
      "type": "button",
      "tagName": "BUTTON",
    }
  },
  "meta": {
    "devicePixelRatio": 2,
    "isBot": false,
    "isMobile": false,
    "isTouch": false,
    "referrer": "",
    "screen": {
      "width": 1512,
      "height": 982
    },
    "window": {
      "width": 793,
      "height": 772
    },
    "scrollDepth": 0,
    "timestamp": 1665935720295,
    "timezone": -300,
    "url": "https://app.autocapture.dev/",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:105.0) Gecko/20100101 Firefox/105.0"
  },
  "session": "b5b9b9b0-5b9b-4b9b-9b9b-b9b9b9b9b9b9",
  "details": {}
}
```

Details fields are plugin specific. For example, the `form` plugin will add the form details to the `details` field.

**Tap Plugin details field output**
```json
{
  "details": {
    "type": "dblclick",
    "x": 123,
    "y": 123
  }
}
```

**Form Plugin details field output**
```json
{
  "details": {
   "type": "input",
    "name": "email",
    "action": "https://app.autocapture.dev/",
    "method": "POST"
  }
}
```

**Page Plugin details field output**
```json
{
  "details": {
    "type": "page-load"
  }
}
```

**Mouse Movement Plugin details field output**
```json
{
  "details": {
    "x": 123,
    "y": 123
  }
}
```

**Scroll Plugin details field output**
```json
{
  "details": {
    "direction": "down",
    "percentage": 50,
    "speed": 100,
    "size": 100
  }
}
```

You can check the output of the other plugins in the [Plugin](./src/plugins) folder.

## Extending AutoCapture.js

You can extend AutoCapture.js by creating a new plugin. A plugin is a class that extends the [PluginBuilder](
/src/core/core.plugin.ts) class.

```js
import { PluginBuilder } from 'autocapture.js';

class MyPlugin extends PluginBuilder {
  // Key is the name of the plugin and should be unique.
  // Also the key is the required parameter.
  key = 'some-new-plugin';

  /**
   *  Method to bind the event listener to the elements using the DOMEvent class.
   *  This method is required and should be implemented.
   */
  bind() {
    // This method is called when the plugin is initialized.
    // You can bind any event listeners here.

    // The importent thing is to return the array of objects with the following structure.
    return [
      {
        // The name of the event to added in payload. (Required)
        name: 'content-loaded',
        // The element to bind the event listener to. (Required)
        target: document,
        // The event to listen to. (Required)
        event: 'DOMContentLoaded',
        // The callback function to call when the event is triggered. (Required)
        callback: this._privateMethod,
        // The options to pass to the addEventListener method. (Optional)
        options: false,
        // The throttling time in milliseconds. (Optional)
        throttle: 1000,
        // The condition function to check if the event should be captured. (Optional)
        condition: (event) => true
      },
      // ... You can add more objects here.
    ]

  }

  /**
   * Your private methods.
   */
  _privateMethod() {
    // ...
    // your code here

    // your callback function should return an object that object will be passed to the event payload.
    return {
      'user-data': {
        id: 1,
        name: 'John Doe'
      }
    }
  }
}
```

Check out the [Tap/Click Plugin](/src/plugins/plugin.tap.ts) for a sample plugin.

## Credits

Made with :heart: by [@seeratawan01](https://github.com/seeratawan01).

## License

MIT License - see the [LICENSE](LICENSE) file for details.
