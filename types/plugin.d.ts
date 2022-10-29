import { BaseOptions } from './base'

export interface Plugin {
  /**
   * The name of the plugin.
   */
  key: string

  /**
   * The options of the plugin.
   */
  options: Record<string, any>

  /**
   * Method to bind the event listener to the elements using the DOMEvent class.
   * @param options The options passed to the core.
   * @return Object target, type, handler, options
   * @public
   */
  bind: (options: BaseOptions) => Record<'target'|'type'|'handler'|'options', any>

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

}
