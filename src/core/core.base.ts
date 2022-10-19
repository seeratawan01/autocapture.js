import { BaseOptions, Persistence } from '../types'
import Store from './core.store'
import { DEFAULT_PERSISTENCE } from '../constant'

export default abstract class Base {
  protected persistence: Persistence
  protected onEventCapture: (eventData: Record<string, any>) => void
  protected store: Store = Store.getInstance()

  protected constructor({ persistence, onEventCapture }: BaseOptions) {
    // Default Values
    this.persistence = persistence || DEFAULT_PERSISTENCE

    // On event capture callback
    this.onEventCapture = onEventCapture || ((_: Record<string, any>) => ({}))


    // Setting common states in store
    this.store.set('persistence', this.persistence)

  }

  abstract start(): void

  abstract stop(): void

  protected abstract captureEvent(event: Event): boolean | void
}
