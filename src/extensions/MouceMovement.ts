/**
 * Recording visitor's mouse movements
 */
import { RootCapture, storeEvent } from '../core'
import { AutoCaptureProps } from '../types'

export default class MouseMovement extends RootCapture {
  private readonly captureMouseMoveEventHandler: OmitThisParameter<(event: Event) => void>

  constructor({ persistence, onEventCapture }: AutoCaptureProps) {
    super({ persistence, onEventCapture })
    this.captureMouseMoveEventHandler = this.captureEvent.bind(this)
  }

  public start(): void {
    console.log('start capturing mouse movements')
    this.bindMouseMoveEvent()
  }

  public stop(): void {
    window.removeEventListener('mousemove', this.captureMouseMoveEventHandler)
  }

  private bindMouseMoveEvent(): void {
    window.addEventListener('mousemove', this.captureMouseMoveEventHandler)
  }

  protected captureEvent(event: Event): void {
    const eventData = this.getMouseMovementData(event)
    this.onEventCapture(eventData)
    storeEvent(eventData, this.persistence, this.onEventCapture)
  }

  private getMouseMovementData(event: Event): Record<string, any> {
    const { clientX, clientY } = event as MouseEvent
    return {
      type: 'mouse_movement',
      clientX,
      clientY,
    }
  }


}
