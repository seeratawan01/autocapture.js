export interface Plugin {

  /**
   * The name of the plugin.
   */
  key: string,

  /**
   * Capture an event.
   */
  captureEvent(event: Event): boolean | void,

}
