## Plugin
The plugin system is a way to extend the functionality of the core library.

### Plugin Builder Class
The plugin creation is made easy with the PluginBuilder Module.

**PluginBuilder class**  helps you to create new plugins with simply extending it. [Source](/src/core/core.plugin.ts).

## Example
```javascript
import { PluginBuilder } from 'autocapture';

export class MyPlugin extends PluginBuilder {

  key = 'my-plugin';

  bind() {
    return {
      target: '#my-svg',
      event: 'click',
      handler: (event) => {
        return {
          svg: {
            id: event.target.id,
            class: event.target.className,
            text: event.target.textContent,
          }
        }
      }
    }
  }

  onBeforeCapture(payload) {
    // here check the final payload before storing it

    return true; // return true to continue the capture
  }

  onEventCapture(payload) {
    // here you can do something with the payload
  }
}

```

You can then use the plugin in your application:

```javascript
import { AutoCapture } from 'autocapture';
import { MyPlugin } from './my-plugin';

AutoCapture.use(new MyPlugin());
```

You can check the scroll plugin [here](/src/plugins/plugin.scroll.ts) for more details.
