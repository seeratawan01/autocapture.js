import { AutoCaptureProps, EventAttributes } from './types'
import { clearStoredEvents, getEventData, getStoredEvents, storeEvent } from './utils'
import { DEFAULT_ATTRIBUTES } from './constant'

/**
 *  A library to provide an easiest and most comprehensive way to automatically capture the user
 *  interactions on your site, from the moment of installation forward. A single snippet grabs
 *  every click, swipe, tap, page-view, and fill — forever.
 */
export default class AutoCapture {
  private elements: Array<HTMLElement | Window | Document>
  private attributes: Array<EventAttributes>
  private debug: boolean
  private safelist: Array<string>
  private persistence: 'cookie' | 'localStorage' | 'memory'

  constructor({ elements, safelist, attributes, debug, persistence }: AutoCaptureProps) {
    this.elements = elements || [document]
    this.safelist = safelist || []
    this.attributes = attributes || DEFAULT_ATTRIBUTES
    this.debug = debug || false
    this.persistence = persistence || 'memory'

    window.autoCaptureEvents = []
  }

  /**
   * A function to start capturing the user interactions (click, swipe, tap, page-view, and fill) on your site, from the moment of
   * installation forward.
   */
  public start(): void {
    console.log('start capturing user interactions')
    this.elements.forEach(element => {
      element.addEventListener('click', this.captureEvent.bind(this), true)
      element.addEventListener('change', this.captureEvent.bind(this), true)
      element.addEventListener('submit', this.captureEvent.bind(this), true)
      element.addEventListener('touchstart', this.captureEvent.bind(this), true)
      element.addEventListener('touchmove', this.captureEvent.bind(this), true)
      element.addEventListener('touchcancel', this.captureEvent.bind(this), true)
    })
  }

  /**
   * A function to stop capturing the user interactions on your site, from the moment of installation forward.
   */
  public stop(): void {
    this.elements.forEach(element => {
      element.removeEventListener('click', this.captureEvent.bind(this), true)
      element.removeEventListener('change', this.captureEvent.bind(this), true)
      element.removeEventListener('submit', this.captureEvent.bind(this), true)
      element.removeEventListener('touchstart', this.captureEvent.bind(this), true)
      element.removeEventListener('touchmove', this.captureEvent.bind(this), true)
      element.removeEventListener('touchcancel', this.captureEvent.bind(this), true)
    })
  }

  /**
   * A function to capture the user interactions on your site, from the moment of installation forward.
   * @param event
   * @private
   */
  private captureEvent(event: Event): boolean | void {
    // Skip the event if the target is in the safe list selector
    if (this.safelist.some(selector => (event.target as HTMLElement).matches(selector))) {
      return false
    }

    const data = getEventData(event, this.attributes)

    if (this.debug) {
      console.debug(data)
    }

    storeEvent(data, this.persistence)

    console.log(getStoredEvents(this.persistence))
  }

  /**
   * A function to get the captured user interactions on your site, from the moment of installation forward.
   */
  public getCapturedEvents(): any[] {
    return getStoredEvents(this.persistence)
  }

  /**
   * A function to clear the captured user interactions on your site, from the moment of installation forward.
   */
  public clearCapturedEvents(): void {
    clearStoredEvents(this.persistence)
  }
}
