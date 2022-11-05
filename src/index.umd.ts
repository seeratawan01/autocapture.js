import AutoCapture, {
  FormPlugin, MouseMovementPlugin,
  PageViewPlugin, ScrollPlugin,
  SwipePlugin,
  TapPlugin,
  VideoPlugin
} from '.'

// Auto register all internal plugin
AutoCapture.use(new TapPlugin())
AutoCapture.use(new FormPlugin())
AutoCapture.use(new VideoPlugin())
AutoCapture.use(new SwipePlugin())
AutoCapture.use(new PageViewPlugin())
AutoCapture.use(new MouseMovementPlugin())
AutoCapture.use(new ScrollPlugin())

export default AutoCapture
