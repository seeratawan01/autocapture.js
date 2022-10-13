import { AutoCaptureProps, Capturable, EventAttributes } from './types'
import {
  clearStoredEvents,
  getEventData,
  getPageViewData,
  getStoredEvents,
  shouldCaptureDomEvent,
  storeEvent,
  RootCapture
} from './core'
import { DEFAULT_ATTRIBUTES, DEFAULT_CAPTURE, DEFAULT_ELEMENTS } from './constant'
import ScrollMap from './extensions/scrollMap'
import MouseMovement from './extensions/MouceMovement'


/**
 *  A library to provide an easiest and most comprehensive way to automatically capture the user
 *  interactions on your site, from the moment of installation forward. A single snippet grabs
 *  every click, swipe, tap, page-view, and fill — forever.
 */
export default class AutoCapture extends RootCapture{
  /**
   * A list of elements to capture events from. Defaults to ['a', 'button', 'form', 'input', 'select', 'textarea', 'label'].
   */
  private elements: string[]
  private attributes: Array<EventAttributes>
  private safelist: Array<string>
  private capturable: Capturable[]
  private scrollMap: ScrollMap | null = null
  private captureEventHandler: OmitThisParameter<(event: Event) => (boolean | void)>
  private capturePageViewEventHandler: OmitThisParameter<() => void>
  private mouseMovement: MouseMovement | null = null

  constructor({
                elements,
                safelist,
                attributes,
                persistence,
                onEventCapture,
                capture
              }: AutoCaptureProps) {
    super({
      persistence,
      onEventCapture
    })

    // Default Values
    this.elements = elements || DEFAULT_ELEMENTS
    this.safelist = safelist || []
    this.attributes = attributes || DEFAULT_ATTRIBUTES
    this.capturable = capture || DEFAULT_CAPTURE



    // Global event storage in-memory
    window.autoCaptureEvents = []

    // save the event handler, so it can be used in multiple places
    this.captureEventHandler = this.captureEvent.bind(this)

    // save the page view event handler, so it can be used in multiple places
    this.capturePageViewEventHandler = this.capturePageViewEvent.bind(this)
  }

  /**
   * A function to start capturing the user interactions (click, swipe, tap, page-view, and fill) on your site, from the moment of
   * installation forward.
   */
  public start(): void {
    console.log('start capturing user interactions')

    // Capture page view event
    if (this.capturable.includes('page-view')) {
      // On route change, capture page view again
      window.addEventListener('popstate', this.capturePageViewEventHandler)

      // On page load, capture page view again
      window.addEventListener('load', this.capturePageViewEventHandler)
    }

    // Capture input event
    this.capturable.includes('input') && document.addEventListener('input', this.captureEventHandler, true)


    // Capture click event
    this.capturable.includes('click') && document.addEventListener('click', this.captureEventHandler, true)

    // Capture change event
    this.capturable.includes('change') && document.addEventListener('change', this.captureEventHandler, true)

    // Capture submit event
    this.capturable.includes('submit') && document.addEventListener('submit', this.captureEventHandler, true)

    // Capture touch events
    if (this.capturable.includes('touch')) {
      document.addEventListener('touchstart', this.captureEventHandler, true)
      document.addEventListener('touchmove', this.captureEventHandler, true)
      document.addEventListener('touchcancel', this.captureEventHandler, true)
    }

    // Capture scroll event
    if (this.capturable.includes('scroll')) {
      this.scrollMap = new ScrollMap({
        persistence: this.persistence,
        onEventCapture: this.onEventCapture
      })

      this.scrollMap.start()
    }

    // Capture mouse movement event
    if (this.capturable.includes('mouse-movement')) {

      this.mouseMovement = new MouseMovement({
        persistence: this.persistence,
        onEventCapture: this.onEventCapture
      })

      this.mouseMovement.start()
    }

  }

  /**
   * A function to stop capturing the user interactions on your site.
   */
  public stop(): void {
    document.removeEventListener('click', this.captureEventHandler, true)
    document.removeEventListener('change', this.captureEventHandler, true)
    document.removeEventListener('submit', this.captureEventHandler, true)
    document.removeEventListener('touchstart', this.captureEventHandler, true)
    document.removeEventListener('touchmove', this.captureEventHandler, true)
    document.removeEventListener('touchcancel', this.captureEventHandler, true)
    window.removeEventListener('popstate', this.capturePageViewEventHandler)
    window.removeEventListener('load', this.capturePageViewEventHandler)

    this.scrollMap && this.scrollMap.stop()
  }


  /**
   * A function to capture the page view on your site.
   * @param event
   * @private
   */
  private capturePageViewEvent() {
    const eventData = getPageViewData()
    storeEvent(eventData, this.persistence, this.onEventCapture)
  }


  /**
   * A function to capture the user interactions on your site.
   * @param event
   * @protected
   */
  protected captureEvent(event: Event): boolean | void {

    // Skip the event if the target is not in the elements list
    if (!shouldCaptureDomEvent(this.elements, event)) {
      return false
    }

    // Skip the event if the target is in the safe list selector
    if (this.safelist.some(selector => (event.target as HTMLElement).matches(selector))) {
      return false
    }

    const data = getEventData(event, this.attributes)


    storeEvent(data, this.persistence, this.onEventCapture)

  }

  /**
   * A function to clear the captured user interactions on your site.
   */
  public clear(): void {
    clearStoredEvents(this.persistence)
  }

  /**
   * A function to get the captured user interactions on your site.
   */
  public getCapturedEvents(): any[] {
    return getStoredEvents(this.persistence)
  }

  /**
   * A function to get only the captured user's page views on your site.
   */
  public getPageViews(): any[] {
    return getStoredEvents(this.persistence).filter(event => event.type === 'page-view')
  }
}
