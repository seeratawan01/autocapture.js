import { AutoCapture, ScrollPlugin, PageViewPlugin, MouseMovementPlugin, VideoPlugin, FormPlugin } from '.'

// Auto register all internal plugin
AutoCapture.use(new ScrollPlugin())
AutoCapture.use(new PageViewPlugin())
AutoCapture.use(new MouseMovementPlugin())
AutoCapture.use(new VideoPlugin())
AutoCapture.use(new FormPlugin())

export default AutoCapture
