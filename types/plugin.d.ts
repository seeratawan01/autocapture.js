import { BaseOptions } from './base'

export interface Plugin {

  /**
   * The name of the plugin.
   */
  key: string,


  /**
   * The callback method, called when the event is captured.
   */
  onEventCapture?: (eventData: Record<string, any>) => void,

  /**
   * Capture an event.
   */
  captureEvent(event: Event): boolean | void,

  /**
   * Start capturing events.
   */
  start(options: BaseOptions): void,

  /**
   * Stop capturing events.
   */
  stop(): void,
}
