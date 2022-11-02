import { DOMEvent, JSON, PluginBuilder } from './core'
import { prepareEventPayload, shouldCaptureEvent } from './helpers'
import { AutoCapture as AutoCaptureDefault } from './autoCapture'
import {TapPlugin, VideoPlugin, SwipePlugin, PageViewPlugin, MouseMovementPlugin, ScrollPlugin , FormPlugin} from './plugins'

// Auto register all internal plugin
AutoCaptureDefault.use(new TapPlugin())
AutoCaptureDefault.use(new FormPlugin())
AutoCaptureDefault.use(new VideoPlugin())
AutoCaptureDefault.use(new SwipePlugin())
AutoCaptureDefault.use(new PageViewPlugin())
AutoCaptureDefault.use(new MouseMovementPlugin())
AutoCaptureDefault.use(new ScrollPlugin())

// exporting the default instance with all the plugins
export default AutoCaptureDefault;


// exporting the core classes for minimal bundle size and tree shaking
export { AutoCapture } from './autoCapture'

// exporting the built-in plugins for the developer to use them
export * from './plugins'

// exporting useful modules
export { DOMEvent, JSON, PluginBuilder }

// exporting the useful helper functions
export { shouldCaptureEvent, prepareEventPayload }
