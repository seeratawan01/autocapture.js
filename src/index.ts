import { Base, DOMEvent, JSON, PluginBuilder, PluginRegistry } from './core'
import { Attributes, BaseOptions, Capture, Plugin } from '../types'
import { DEFAULT_OPTIONS } from './constant'
import { prepareEventPayload, shouldCaptureEvent, storePayload } from './helpers'
import { BindResult } from '../types/plugin'

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
  private lastEvent: number

  private events: DOMEvent[] = []

  /**
   * Constructor for the AutoCapture class.
   * @param options - The options to use for the AutoCapture instance.
   * @param options.elements - A list of elements to capture events from. Defaults to ['a', 'button', 'form', 'input', 'select', 'textarea', 'label'].
   * @param options.attributes - A list of attributes to capture from the event target. Defaults to `['text', 'className', 'value', 'type', 'tagName', 'href', 'src', 'id', 'name', 'placeholder', 'title', 'alt', 'role']`.
   * @param options.safelist - A list of selectors to ignore to avoid capturing any sensitive data. Defaults to `[]`.
   * @param options.capture - A list of events to capture. Defaults to `['click', 'change', 'submit']`.
   * @param options.plugins - A list of plugins to use. Defaults to `['scroll', 'mouse-movement']`.
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

    // initialize the plugins
    PluginRegistry.getAll().forEach(plugin => {
      plugin.onInit({
        elements,
        attributes,
        safelist,
        capture,
        ...options
      })
    })

  }

  /**
   * start capturing the user interactions (click, swipe, tap, page-view, and fill) on the site.
   * @public
   */
  start(): void {
    // Bind the event listener
    this.bind()

    // Start all the registered plugins
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
   * starting all plugins.
   */
  private startPlugins(): void {
    console.log(PluginRegistry.getAll())


    // start all the plugins
    PluginRegistry.getAll().forEach(plugin => {
      console.log(`Starting ${plugin.key} plugin`)
      const pluginData = plugin.bind(plugin.getOptions())

      // if the plugin has a bind function, it is not implemented yet
      if (!pluginData) {
        return
      }

      // loop through the
      pluginData.forEach((data: any) => {
        // getting the plugin data
        const { target, event, callback, options, name, throttle, condition }: BindResult = data

        if ((target instanceof HTMLElement || target instanceof Document || target instanceof Window) && typeof callback === 'function' && typeof event === 'string') {
          // if the condition is not met, do not bind the event
          if (condition && typeof condition === 'function' && !condition()) {
            return
          }


          // to prevent massive data collection, we only capture every 100ms
          if (throttle) {
            const now = Date.now()
            if (now - this.lastEvent < throttle) {
              return
            }
            this.lastEvent = now
          }

          // bind the event
          this.events.push(new DOMEvent(event, (e) => wrappedHandler(e, name, callback), options, target, plugin.key).bind()
          )
        }

      })

      // wrapping the handler to capture the event
      const wrappedHandler = (event: Event, type, handler) => {
        if (plugin.onBeforeCapture(event)) {

          let payload = prepareEventPayload(event, {
            attributes: this.attributes,
            sessionId: this.sessionId,
            payload: this.payload,
            type,
            maskTextContent: this.maskTextContent
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


          if (storePayload(payload, this.persistence)) {
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
      this.capturable.includes('click') && this.events.push(new DOMEvent('click', this.captureEvent, { capture: true }, document).bind())
      this.capturable.includes('double-click') && this.events.push(new DOMEvent('dblclick', this.captureEvent, { capture: true }, document).bind())
      this.capturable.includes('context-menu') && this.events.push(new DOMEvent('contextmenu', this.captureEvent, { capture: true }, document).bind())
      this.capturable.includes('touch') && this.events.push(new DOMEvent('touchstart', this.captureEvent, { capture: true }, document).bind())
      this.capturable.includes('touch') && this.events.push(new DOMEvent('touchend', this.captureEvent, { capture: true }, document).bind())
      this.capturable.includes('touch') && this.events.push(new DOMEvent('touchmove', this.captureEvent, { capture: true }, document).bind())
    }
  }

  /**
   * Unbind the event listeners.
   */
  unbind(): void {
    this.events.forEach(event => event.unbind())
  }

  /**
   * The function to capture the event.
   */
  protected captureEvent(event: Event): void {

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

    if (storePayload(payload, this.persistence)) {
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
    if (events) {
      if (typeof events === 'string') {
        return JSON.parse(events)
      } else {
        return events
      }
    }
    return []
  }

  /**
   * Unregister the installed plugin.
   * @public
   * @param {string} key - The plugin key.
   * @returns {void}
   */
  public unregisterPlugin(key: string): void {
    // check if the plugin is installed
    if (!PluginRegistry.has(key)) {
      throw new Error(`The plugin ${key} is not installed.`)
    }

    // find the events that are bound to the plugin
    const events = this.events.filter(event => event.key === key)

    // unbind the events
    events.forEach(event => event.unbind())

    // remove the plugin from the registry
    PluginRegistry.unregister(key)
  }

  /**
   * Register the plugin to use it in the AutoCapture instance.
   * @param plugin - function returns an object of type Plugin.
   * @static
   * @public
   */
  public static use(plugin: Plugin): void {

    // check if the plugin is already registered
    if (PluginRegistry.get(plugin.key)) {
      throw new Error(`Plugin with key ${plugin.key} is already registered.`)
    }

    PluginRegistry.register(plugin)
  }
}

// exporting the built-in plugins for the developer to use them
export * from './plugins'

// exporting useful modules
export { DOMEvent, JSON, PluginBuilder }

// exporting the useful helper functions
export { shouldCaptureEvent, prepareEventPayload }
