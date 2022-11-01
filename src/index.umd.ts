import { AutoCapture, ScrollPlugin, PageViewPlugin } from '.'

// Auto register all internal plugin
AutoCapture.use(new ScrollPlugin())
AutoCapture.use(new PageViewPlugin())
// AutoCapture.use(new MouseMovementPlugin())

export default AutoCapture
