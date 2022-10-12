/**
 * Scroll maps show you the exact percentage of people who scroll down to any point on the page: the redder the area, the more visitors saw it.
 */
import { getEventData, storeEvent } from '../utils'
import { AutoCaptureProps } from '../types'

export default class ScrollMap {

  private scrollPercentage: number
  private persistence: 'cookie' | 'localStorage' | 'memory'
  private onEventCapture: (eventData: Record<string, any>) => void

  /**
   * Scroll map constructor function.
   */
  constructor({
                persistence,
                onEventCapture
              }: AutoCaptureProps) {
    this.scrollPercentage = 0.0
    this.persistence = persistence || 'memory'
    this.onEventCapture = onEventCapture || ((eventData: Record<string, any>) => ({}))

    // Init scroll map events capturing
    this.init()
  }

  /**
   * A function to start capturing the scroll events on your site.
   */
  public init(): void {
    console.log('start capturing scroll events')
    this.bindScrollEvent()
  }

  /**
   * Bind scroll event to the window.
   */
  private bindScrollEvent(): void {
    window.addEventListener('scroll', this.captureScrollEvent.bind(this))
  }

  /**
   * A function to capture the scroll events on your site.
   */
  private captureScrollEvent(event: Event): void {
    const scrollPercentage = this.getScrollPercentage()
    if (scrollPercentage > this.scrollPercentage) {
      this.scrollPercentage = scrollPercentage
      this.sendScrollPercentage(event)
    }
  }

  /**
   * A function to get the scroll percentage.
   */
  private getScrollPercentage(): number {
    const scrollPosition = window.scrollY
    const windowSize = window.innerHeight
    const bodyHeight = document.body.offsetHeight

    return Math.round((scrollPosition / (bodyHeight - windowSize)) * 100)
  }

  /**
   * A function to send the scroll percentage to the server.
   */
  private sendScrollPercentage(event: Event): void {
    console.log('scroll percentage sent to the server')

    const data = {
      ...getEventData(event, []),
      scroll: {
        scrollPercentage: this.scrollPercentage,
        scrollPosition: window.scrollY,
        windowSize: window.innerHeight,
        bodyHeight: document.body.offsetHeight
      }
    }


    storeEvent(data, this.persistence, this.onEventCapture)
  }
}
