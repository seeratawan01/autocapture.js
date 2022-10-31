import { BaseOptions } from '../types'
import Persistence from './core.persistence'
import { DEFAULT_OPTIONS } from '../constant'

export default abstract class Base {


  /**
   * The persistence object to use for persistence.
   * @protected
   */
  protected persistence: Storage = null

  /**
   * Custom payload to be added to the captured event.
   * @protected
   */
  protected payload: Record<string, any>

  /**
   * Custom session id.
   * @protected
   */
  protected sessionId: string

  /**
   * Specify if you want to mask the text content of the elements.
   * @protected
   */
  maskTextContent: boolean

  /**
   * On event capture callback.
   * @protected
   */
  public onEventCapture: (eventData: Record<string, any>) => void

  protected constructor({ persistence, payload, sessionId, onEventCapture, maxEvents, maskTextContent }: BaseOptions) {

    // Set the persistence object if persistence is not set to none.
    this.persistence = Persistence.getInstance(persistence || DEFAULT_OPTIONS.PERSISTENCE, maxEvents || DEFAULT_OPTIONS.MAX_EVENTS)

    // Set the custom payload.
    this.payload = payload || {}

    // Set the session id.
    this.sessionId = sessionId || ''


    // Set the mask text content.
    this.maskTextContent = maskTextContent || DEFAULT_OPTIONS.MASK_TEXT_CONTENT

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
   * Clear all the captured events or specific.
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
   * @protected
   */
  protected getAll(): Record<string, any> {
    if (this.persistence) {
      return this.persistence.getAll()
    }
    return {}
  }
}
