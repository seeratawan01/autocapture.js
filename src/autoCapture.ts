import { Base, DOMEvent, JSON, PluginRegistry } from './core'
import { BaseOptions, Plugin } from '../types'
import { DEFAULT_OPTIONS } from './constant'
import { prepareEventPayload, storePayload } from './helpers'
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

  private lastEvent: number

  private events: DOMEvent[] = []

  /**
   * Constructor for the AutoCapture class.
   * @param options - The options to use for the AutoCapture instance. See the BaseOptions interface for more details.
   * @public
   * @constructor
   */
  constructor(options: BaseOptions) {

    // Set the default options
    let settings = Object.assign({}, {
      elements: DEFAULT_OPTIONS.ELEMENTS,
      attributes: DEFAULT_OPTIONS.ATTRIBUTES,
      safelist: DEFAULT_OPTIONS.SAFELIST,
      capture: DEFAULT_OPTIONS.CAPTURE,
      payload: DEFAULT_OPTIONS.PAYLOAD,
      maskTextContent: DEFAULT_OPTIONS.MASK_TEXT_CONTENT,
      sessionId: '',
      persistence: DEFAULT_OPTIONS.PERSISTENCE,
      maxEvents: DEFAULT_OPTIONS.MAX_EVENTS,
    }, options)

    // Call the super constructor
    super(settings)

    // initialize the plugins
    PluginRegistry.getAll().forEach(plugin => {
      plugin.onInit({
        ...settings
      })
    })

  }

  /**
   * start capturing the user interactions (click, swipe, tap, page-view, and fill) on the site.
   * @public
   */
  public start(): void {
    // Bind the event listener
    this.bind()
  }

  /**
   * Stop capturing events.
   */
  public stop(): void {
    // Unbind the event listener
    this.unbind()

    // Stop all the plugins
    PluginRegistry.getAll().forEach(plugin => plugin.onStop())
  }


  /**
   * starting all plugins.
   */
  private startPlugins(): void {

    // start all the plugins
    PluginRegistry.getAll().forEach(plugin => {

      // check if the plugin is in capture list
      if (!this.settings.capture.includes(plugin.key)) {
        console.log(`Skipping ${plugin.key} plugin`)
        return
      }

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
            attributes: this.settings.attributes,
            sessionId: this.settings.sessionId,
            payload: this.settings.payload,
            type,
            maskTextContent: this.settings.maskTextContent
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
  private bind(): void {
    // Start all the registered plugins
    this.startPlugins()
  }

  /**
   * Unbind the event listeners.
   */
  private unbind(): void {
    this.events.forEach(event => event.unbind())
  }

  /**
   * The function to clear all the captured events from storage.
   */
  public clearCapturedEvents(): void {
    this.persistence.clear()
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


