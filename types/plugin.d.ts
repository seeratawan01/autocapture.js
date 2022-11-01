import { BaseOptions } from './base'

export type BindResult = {
  /**
   * The name of the event to added in payload.
   */
  name: string
  /**
   * The target element to bind the event listener to.
   */
  target: EventTarget
  /**
   * The javascript event type.
   */
  event: string

  /**
   * The event handler.
   * @param event
   */
  callback: (event: any) => Record<string, any>

  /**
   * The event options.
   */
  options?: boolean | AddEventListenerOptions

  /**
   * The throttling time in milliseconds.
   */
  throttle?: number,

  /**
   * The condition function to check if the event should be captured.
   */
  condition?: () => boolean
}

export interface Plugin {
  /**
   * The name of the plugin.
   */
  key: string

  /**
   * Method to bind the event listener to the elements using the DOMEvent class.
   * @param options The options passed to the core.
   * @return Array of object target, type, handler, options and name
   * @public
   */
  bind: (options: BaseOptions) => BindResult[]

  /**
   * The callback method, called when the plugin is initialized.
   * @param options The options passed to the core.
   */
  onInit?: (options: BaseOptions) => void

  /**
   *  The callback method, called when the plugin is started.
   */
  onStart?: () => void

  /**
   * The callback method, called when the plugin is stopped.
   */
  onStop?: () => void


  /**
   * The callback method, called before the event is captured.
   * @param event The event to be captured.
   * @returns true if the event should be captured, false otherwise.
   */
  onBeforeCapture?: (event: Event) => boolean

  /**
   * The callback method, called when the event is captured.
   * @param eventData The data of the captured event.
   */
  onEventCapture?: (eventData: Record<string, any>) => void


  /**
   * Get the options of the plugin.
   */
  getOptions?: () => Record<string, any>

}
