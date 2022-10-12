import { AutoCaptureProps, Capturable, EventAttributes } from './types'
import {
  clearStoredEvents,
  getEventData,
  getPageViewData,
  getStoredEvents,
  shouldCaptureDomEvent,
  storeEvent
} from './utils'
import { DEFAULT_ATTRIBUTES, DEFAULT_ELEMENTS } from './constant'
import ScrollMap from './extra/scrollMap'
/**
 *  A library to provide an easiest and most comprehensive way to automatically capture the user
 *  interactions on your site, from the moment of installation forward. A single snippet grabs
 *  every click, swipe, tap, page-view, and fill — forever.
 */
export default class AutoCapture {
  /**
   * A list of elements to capture events from. Defaults to ['a', 'button', 'form', 'input', 'select', 'textarea', 'label'].
   */
  private elements: string[]
  private attributes: Array<EventAttributes>
  private safelist: Array<string>
  private persistence: 'cookie' | 'localStorage' | 'memory'
  private onEventCapture: (eventData: Record<string, any>) => void
  private capturable: Capturable[]
  private pluginInstance: any[] = []

  constructor({ elements, safelist, attributes, persistence, onEventCapture, capture }: AutoCaptureProps) {
    this.elements = elements || DEFAULT_ELEMENTS
    this.safelist = safelist || []
    this.attributes = attributes || DEFAULT_ATTRIBUTES
    this.persistence = persistence || 'memory'
    this.onEventCapture = onEventCapture || ((eventData: Record<string, any>) => ({}))
    this.capturable = capture || ['click', 'change', 'submit']
    window.autoCaptureEvents = []
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
      window.addEventListener('popstate', this.capturePageViewEvent.bind(this))

      // On page load, capture page view again
      window.addEventListener('load', this.capturePageViewEvent.bind(this))
    }


    // Capture click event
    this.capturable.includes('click') && document.addEventListener('click', this.captureEvent.bind(this), true)

    // Capture change event
    this.capturable.includes('change') && document.addEventListener('change', this.captureEvent.bind(this), true)

    // Capture submit event
    this.capturable.includes('submit') && document.addEventListener('submit', this.captureEvent.bind(this), true)

    // Capture touch events
    if (this.capturable.includes('touch')) {
      document.addEventListener('touchstart', this.captureEvent.bind(this), true)
      document.addEventListener('touchmove', this.captureEvent.bind(this), true)
      document.addEventListener('touchcancel', this.captureEvent.bind(this), true)
    }

    // Capture scroll event
    if (this.capturable.includes('scroll')) {
      let scrollMap = new ScrollMap({
        persistence: this.persistence,
        onEventCapture: this.onEventCapture
      })

    }

  }

  /**
   * A function to stop capturing the user interactions on your site, from the moment of installation forward.
   */
  public stop(): void {
    document.removeEventListener('click', this.captureEvent.bind(this), true)
    document.removeEventListener('change', this.captureEvent.bind(this), true)
    document.removeEventListener('submit', this.captureEvent.bind(this), true)
    document.removeEventListener('touchstart', this.captureEvent.bind(this), true)
    document.removeEventListener('touchmove', this.captureEvent.bind(this), true)
    document.removeEventListener('touchcancel', this.captureEvent.bind(this), true)
    window.removeEventListener('popstate', this.capturePageViewEvent.bind(this))
    window.removeEventListener('load', this.capturePageViewEvent.bind(this))
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
   * @private
   */
  private captureEvent(event: Event): boolean | void {

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
   * A function to get the captured user interactions on your site, from the moment of installation forward.
   */
  public getCapturedEvents(): any[] {
    return getStoredEvents(this.persistence)
  }

  /**
   * A function to clear the captured user interactions on your site.
   */
  public clearCapturedEvents(): void {
    clearStoredEvents(this.persistence)
  }

  /**
   * A function to get only the captured user's page views on your site.
   */
  public getPageViews(): any[] {
    return getStoredEvents(this.persistence).filter(event => event.type === 'page-view')
  }
}
