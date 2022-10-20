import { BaseOptions } from '../types'
import Persistence from './core.persistence'
import { DEFAULT_OPTIONS } from '../constant'

export default abstract class Base {


  /**
   * The persistence object to use for persistence.
   * @protected
   */
  protected persistence: Persistence | null = null

  /**
   * On event capture callback.
   * @protected
   */
  protected onEventCapture: (eventData: Record<string, any>) => void

  protected constructor({ persistence, onEventCapture }: BaseOptions) {

    // Set the persistence object if persistence is not set to none.
    this.persistence = Persistence.getInstance(persistence || DEFAULT_OPTIONS.PERSISTENCE)


    // On event capture callback
    this.onEventCapture = onEventCapture || ((_: Record<string, any>) => ({}))

  }

  /**
   * Start capturing events.
   * @public
   */
  abstract start(): void

  /**
   * Stop capturing events.
   * @public
   */
  abstract stop(): void

  /**
   * Capture an event.
   * @param event - The event to capture.
   * @protected
   */
  protected abstract captureEvent(event: Event): boolean | void

  /**
   * Clear all the captured events.
   * @param eventKey - The event to clear.
   * @protected
   */
  protected clear(eventKey?: string): void {
    if (this.persistence) {
      if (eventKey) {
        this.persistence.removeItem(eventKey)
      } else {
        this.persistence.clear()
      }
    }
  }

  /**
   * Get all the captured events.
   * @param event - The event to get.
   * @protected
   */
  protected getAll(eventKey?: string): Record<string, any> {
    if (this.persistence) {
      if (eventKey) {
        return this.persistence.getItem(eventKey) || {}
      } else {
        return this.persistence.getAll()
      }
    }
    return {}
  }
}
