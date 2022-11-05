import { DOMEvent, JSON, PluginBuilder } from './core'
import { prepareEventPayload, shouldCaptureEvent } from './helpers'
import { AutoCapture } from './autoCapture'

// exporting the default instance with all the plugins
export default AutoCapture;

// exporting the built-in plugins for the developer to use them
export * from './plugins'

// exporting useful modules
export { DOMEvent, JSON, PluginBuilder }

// exporting the useful helper functions
export { shouldCaptureEvent, prepareEventPayload }
