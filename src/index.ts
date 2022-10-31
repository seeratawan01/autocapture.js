import { Base, DOMEvent, JSON, PluginRegistry, PluginBuilder } from './core'
import { Attributes, BaseOptions, Capture, Plugin } from '../types'
import { DEFAULT_OPTIONS } from './constant'
import { prepareEventPayload, shouldCaptureEvent, storePayload } from './helpers'

/**
 *  A library to provide an easiest and most comprehensive way to automatically capture the user
 *  interactions on your site, from the moment of installation forward. A single snippet grabs
 *  every click, swipe, tap, page-view, and fill — forever.
 *
 *  @class Core
 *  @extends Base
 *  @example
 *  // To use the library:
 *  import AutoCapture from 'autoCapture'
 *  const autoCapture = new AutoCapture({
 *    // options
 *    // ...
 *  })
 *  autoCapture.start()
 *
 */
export class AutoCapture extends Base {
  private elements: string[]
  private attributes: Array<Attributes>
  private safelist: Array<string>
  private capturable: Capture[]


  /**
   * Constructor for the AutoCapture class.
   * @param options - The options to use for the AutoCapture instance.
   * @param options.elements - A list of elements to capture events from. Defaults to ['a', 'button', 'form', 'input', 'select', 'textarea', 'label'].
   * @param options.attributes - A list of attributes to capture from the event target. Defaults to `['text', 'className', 'value', 'type', 'tagName', 'href', 'src', 'id', 'name', 'placeholder', 'title', 'alt', 'role']`.
   * @param options.safelist - A list of selectors to ignore to avoid capturing any sensitive data. Defaults to `[]`.
   * @param options.capture - A list of events to capture. Defaults to `['click', 'change', 'submit']`.
   * @param options.X - A Callback function fires on captured event stored.
   * @param options.persistence - A string to set the persistence method. Defaults to `memory`.
   * @public
   * @constructor
   */
  constructor({
                elements = DEFAULT_OPTIONS.ELEMENTS,
                attributes = DEFAULT_OPTIONS.ATTRIBUTES,
                safelist = DEFAULT_OPTIONS.SAFELIST,
                capture = DEFAULT_OPTIONS.CAPTURE,
                ...options
              }: BaseOptions) {
    super(options)

    // Default Values
    this.elements = elements
    this.safelist = safelist
    this.attributes = attributes
    this.capturable = capture

    // save the event handler, so it can be used in multiple places
    this.captureEvent = this.captureEvent.bind(this)

    // start capturing the user interactions
    this.start()

    // initialize the plugins
    PluginRegistry.getAll().forEach(plugin => plugin.onInit({
      elements,
      attributes,
      safelist,
      capture,
      ...options
    }))
  }

  /**
   * start capturing the user interactions (click, swipe, tap, page-view, and fill) on the site.
   * @public
   */
  start(): void {
    // Bind the event listener
    this.bind()

    this.startPlugins()
  }

  /**
   * Stop capturing events.
   */
  stop(): void {
    // Unbind the event listener
    this.unbind()

    // Stop all the plugins
    PluginRegistry.getAll().forEach(plugin => plugin.onStop())
  }


  /**
   * Initialize the plugins.
   */
  private startPlugins(): void {
    // start all the plugins
    PluginRegistry.getAll().forEach(plugin => {
      const pluginData = plugin.bind(plugin.getOptions())

      // if the plugin has a bind function, it is not implemented yet
      if (!pluginData) {
        return
      }

      // loop through the
      pluginData.forEach((data: any) => {
        // getting the plugin data
        const { target, type, handler, options } = data

        if ((target instanceof HTMLElement || target instanceof Document || target instanceof Window) && typeof handler === 'function' && typeof type === 'string') {
          new DOMEvent(type, wrappedHandler, options, target).bind()
        }

      })

      // wrapping the handler to capture the event
      const wrappedHandler = (event: Event) => {
        if (plugin.onBeforeCapture(event)) {
          let payload = prepareEventPayload(event, {
            attributes: this.attributes,
            sessionId: this.sessionId,
            payload: this.payload,
            type,
            maskTextContent: this.maskTextContent,
          })

          // adding the data from the handler
          const data = handler(event, payload)

          // if the handler returns false, don't capture the event
          if (data === false) {
            return
          }

          // if the handler returns an object, merge it with the payload
          if (typeof data === 'object') {
            payload = JSON.merge(payload, data)
          }


          if (storePayload(payload)) {
            this.onEventCapture(payload)
            plugin.onEventCapture(payload)
          }

        }

      }

    })
  }

  /**
   * Bind the event listener to the elements using the DOMEvent class.
   */
  bind(): void {
    //  Capture DOM events on every elements
    if (this.capturable.length) {
      this.capturable.includes('click') && new DOMEvent('click', this.captureEvent).bind()
      this.capturable.includes('double-click') && new DOMEvent('dblclick', this.captureEvent).bind()
      this.capturable.includes('context-menu') && new DOMEvent('contextmenu', this.captureEvent).bind()
      this.capturable.includes('input') && new DOMEvent('input', this.captureEvent).bind()
      this.capturable.includes('change') && new DOMEvent('change', this.captureEvent).bind()
      this.capturable.includes('submit') && new DOMEvent('submit', this.captureEvent).bind()
      this.capturable.includes('touch') && new DOMEvent('touchstart', this.captureEvent).bind()
      this.capturable.includes('touch') && new DOMEvent('touchend', this.captureEvent).bind()
      this.capturable.includes('touch') && new DOMEvent('touchcancel', this.captureEvent).bind()
    }

    // Capture page view event
    this.capturable.includes('page-view') && new DOMEvent('popstate', this.captureEvent, {}, window).bind()
    this.capturable.includes('page-view') && new DOMEvent('load', this.captureEvent, {}, window).bind()
  }

  /**
   * Unbind the event listeners.
   */
  unbind(): void {
    DOMEvent.purge()
  }

  /**
   * The function to capture the event.
   */
  protected captureEvent(event: Event): void {

    // Check if the event is for page view
    if (event.type === 'popstate' || event.type === 'load') {
      this.capturePageView(event)
      return
    }

    // Skip the event if the target is not in the elements list
    if (!shouldCaptureEvent(this.elements, event)) {
      return
    }


    // Skip the event if the target is in the safe list selector
    if (this.safelist.some(selector => (event.target as HTMLElement).matches(selector))) {
      return
    }

    // Extracting the data from the event attributes
    const payload = prepareEventPayload(event, {
      attributes: this.attributes,
      sessionId: this.sessionId,
      payload: this.payload,
      type: event.type,
      maskTextContent: this.maskTextContent
    })

    if (storePayload(payload)) {
      this.onEventCapture(payload)
    }
  }

  /**
   * The function to capture the page view event.
   */
  private capturePageView(event: Event): void {
    // Extracting the data from the event attributes
    const payload = prepareEventPayload(event, {
      attributes: this.attributes,
      sessionId: this.sessionId,
      payload: this.payload,
      type: 'page-view',
      maskTextContent: this.maskTextContent
    })

    if (storePayload(payload)) {
      this.onEventCapture(payload)
    }
  }

  /**
   * The function to get all the captured events from storage.
   * @public
   * @returns {JSON[]} - An array of JSON objects.
   */
  public getCapturedEvents(): any[] {
    let events = this.persistence?.getItem(DEFAULT_OPTIONS.STORAGE_KEY)
    return events ? JSON.parse(events) : []
  }

  /**
   * Register the plugin to use it in the AutoCapture instance.
   * @param plugin - function returns an object of type Plugin.
   * @static
   * @public
   */
  public static use(plugin: Plugin): void {
    PluginRegistry.register(plugin)
  }
}

// exporting the built-in plugins for the user to use them
export * from './plugins'

// exporting useful modules
export { DOMEvent, JSON, PluginBuilder }

// exporting the useful helper functions
export {shouldCaptureEvent, prepareEventPayload, storePayload}
