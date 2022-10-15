/**
 * Recording visitor's mouse movements
 */
import { getEventData, getMouseEventCoordinates, RootCapture, storeEvent } from '../core'
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
    const eventData = {
      ...getEventData(event, []),
      mouse: getMouseEventCoordinates(event as MouseEvent)
    }
    this.onEventCapture(eventData)
    storeEvent(eventData, this.onEventCapture)
  }


}

// https://incolumitas.com/2020/12/24/recording-mouse-movements-with-javascript/
