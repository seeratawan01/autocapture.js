import { AutoCaptureProps, Persistence } from '../types'

export abstract class RootCapture {
  protected persistence: Persistence
  protected onEventCapture: (eventData: Record<string, any>) => void

  protected constructor({ persistence, onEventCapture }: AutoCaptureProps) {
    // Default Values
    this.persistence = persistence || 'memory'

    // On event capture callback
    this.onEventCapture = onEventCapture || ((eventData: Record<string, any>) => ({}))

  }

  abstract start(): void

  abstract stop(): void

  protected abstract captureEvent(event: Event): boolean | void
}
