import { AutoCapture, ScrollPlugin, PageViewPlugin, MouseMovementPlugin, VideoPlugin } from '.'

// Auto register all internal plugin
AutoCapture.use(new ScrollPlugin())
AutoCapture.use(new PageViewPlugin())
AutoCapture.use(new MouseMovementPlugin())
AutoCapture.use(new VideoPlugin())

export default AutoCapture
