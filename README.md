# AutoCapture.js
A javascript library to capture every user interactions, it provides an easiest and most comprehensive way  to
automatically capture the user interactions on the website, from the moment of installation forward. A single
snippet grabs every click, touch, select, and fill — forever.

## Features
- Automatically captures every user interactions, such as
  - Click
  - Right Click
  - Double Click
  - Touch
  - Input
  - Change
  - Form Submit
- Build-in Plugins
  - [x] **Scroll** - Capture the scroll event [(Source)](./src/plugins/plugin.scroll.ts)
  - [x] **Mouse Movement** - Capture the mouse movement [(Source)](./src/plugins/plugin.mouse-movement.ts)
  - [x] **Page View** - Capture the page view [(Source)](./src/plugins/plugin.page-view.ts)
- Extendable with custom plugins
- Lightweight and easy to use

## Use Cases

- **User Behavior Analysis** - Understand how users interact with your site, and how they use your
  site to achieve their goals.
- **Track User Journeys** - Track the user journeys from the moment they land on your site, to the
  moment they leave.
- **Custom Analytics Tool** - Build your own analytics tools and libraries using AutoCapture.js to
  track user behavior, and use the data to improve your site. e.g. Heatmap, Session Replay, etc.

## Installation

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
import AutoCapture from 'autoCapture';
```
And to install internal plugins, you can import the plugins in your project using the following:

```javascript
import { ScrollPlugin, MouseMovementPlugin, PageViewPlugin } from 'autoCapture';

AutoCapture.use(new ScrollPlugin());
AutoCapture.use(new MouseMovementPlugin());
AutoCapture.use(new PageViewPlugin());
```



However, you can use CDN to import the library's UMD build in a browser and start using it right
away.

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
  capture: ['click', 'input', 'change'],
  onEventCapture: (event) => {
    console.log('Event stored', event)

    // Send event to the server
    // ...
  }
})

instance.start()
```

**Simple as that** - AutoCapture.js will automatically capture all the user interactions on your
site, from the moment of installation forward.

### Notable Control Options

- **Safelist** - Safelist is a list of CSS selectors that you want to ignore. For example, you can
  ignore all the password inputs by adding `input[type="password"]` to the safelist.
- **Persistence** - Persistence is the way you want to store the captured events. You can choose
  between `memory`, `localStorage`, `sessionStorage` and `none`. `memory` is the default value.
  - `memory` - Events are stored in memory and are lost when the page is refreshed.
  - `localStorage` - Events are stored in the browser's local storage and are persisted across
    sessions.
  - `sessionStorage` - Events are stored in the browser's session storage and are lost when the
    browser is closed.
  - `none` - Events are not stored anywhere.
- **Capture** - Capture is the list of events you want to capture. You can choose between `click`, `input`, `change`,
  `touch`, `submit` are the
  default values.
- **onEventCapture** - onEventCapture is a callback function that will be called every time an event
  is captured. You can use this callback to send the captured events to your server.
  - You can use this callback to send the captured events to your server.
  - You can use this callback to persist the captured events in your own way.
  - You can use this callback to send the captured events to your own analytics tool.

## Complete Options List
See the [Options](./types/base.d.ts) interface for the complete list of options.

| Option | Type | Default                                                         | Description                                                                                                                                                              |
| --- | --- |-----------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| safelist | Array | []                                                              | Safelist is a list of CSS selectors that you want to ignore. For example, you can ignore all the password inputs by adding `input[type="password"]` to the safelist.     |
| persistence | String | 'memory'                                                        | Persistence is the way you want to store the captured events. You can choose between `memory`, `localStorage`, `sessionStorage` and `none`. `memory` is the default value.       |
| capture | Array | ['click', 'change', 'submit']                                   | Capture is the list of events you want to capture. You can choose between `scroll`, `click`, `input`, `change`, `page-view`, `touch`, `submit`, `mouse-movement` are the default values. |
| onEventCapture | Function | (capturedEvent: any) => {}                                      | onEventCapture is a callback function that will be called every time an event is captured. You can use this callback to send the captured events to your server.         |
| elements | Array | ['a', 'button', 'form', 'input', 'select', 'textarea', 'label'] | A list of elements to capture events from.                                                                                                                               |
| attributes | Array | ['text', 'className', 'value', 'type', 'tagName', 'href', 'src', 'id', 'name', 'placeholder', 'title', 'alt', 'role']                                                                | A list of attributes to capture from the elements.                                                                                                                       |

## Available Public Methods

| Method | Description                                 |
| --- |---------------------------------------------|
| start | Start capturing events.                     |
| stop | Stop capturing events.                      |
| clear | Clear all the captured events from storage. |
| getCapturedEvents | Get all the captured events. |
| getPageViews | Get all the captured page views. |

## Sample Captured Events

```json
{
  "type": "click",
  "target": {
    "text": "Click Me",
    "className": "btn btn-primary",
    "value": "",
    "type": "button",
    "tagName": "BUTTON",
    "href": "",
    "src": "",
    "id": "",
    "name": "",
    "placeholder": "",
    "title": "",
    "alt": "",
    "role": ""
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
  "sessionIdsession": {
    "id": "b5b9b9b0-5b9b-4b9b-9b9b-b9b9b9b9b9b9"
  },
  //This will be present only if the events are of type click or mouse movement
  "mouse": {
    "x": 0,
    "y": 0
  },
  //This will be present only if the events are of type scroll
  "scroll": {
    "bodyHeight": 1531,
    "scrollPercentage": 9,
    "scrollPosition": 68,
    "windowSize": 772
  },
  //This will be present only if the events are of type input or change
  "input": {
    "value": "Hello World"
  },
  //This will be present only if the events are of type submit
  "form": {
    "action": "https://app.autocapture.dev/",
    "method": "get",
    "name": "",
    "id": ""
  },
  //This will be present only if the events are of type touch
  "touch": {
    "x": 0,
    "y": 0
  }
}
```

## Extending AutoCapture.js
You can extend AutoCapture.js by creating a new plugin. A plugin is a class that extends the [PluginBuilder](
/src/core/core.plugin.ts) class.

```js
import { PluginBuilder } from 'autocapture.js';

class MyPlugin extends PluginBuilder {
  // Key is the name of the plugin and should be unique.
  // Also the key is the required parameter.
  key = 'page-view-internal'

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
        // The name of the event to added in payload.
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
        condition: () => true
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
Check out the [Mouse Movement Plugin](/src/plugins/plugin.mouse-movement.ts) for a sample plugin.

## Credits

Made with :heart: by [@seeratawan01](https://github.com/seeratawan01).

## License

MIT License - see the [LICENSE](LICENSE) file for details.
