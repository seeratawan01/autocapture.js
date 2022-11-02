import { BaseOptions } from '../types'
import Persistence from './core.persistence'
import { DEFAULT_OPTIONS } from '../constant'

export default abstract class Base {

  /**
   * The plugin settings.
   * @protected
   */
  protected settings: BaseOptions = {}

  /**
   * The persistence object to use for persistence.
   * @protected
   */
  protected persistence: Storage = null


  /**
   * On event capture callback.
   * @protected
   */
  public onEventCapture: (eventData: Record<string, any>) => void

  protected constructor(settings: BaseOptions) {

    this.settings = settings

    // Set the persistence object if persistence is not set to none.
    this.persistence = Persistence.getInstance(this.settings.persistence || DEFAULT_OPTIONS.PERSISTENCE, this.settings.maxEvents || DEFAULT_OPTIONS.MAX_EVENTS)

    // On event capture callback
    this.onEventCapture = this.settings.onEventCapture || ((_: Record<string, any>) => ({}))

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
