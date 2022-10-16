/**
 * Scroll maps show you the exact percentage of people who scroll down to any point on the page: the redder the area, the more visitors saw it.
 */
import { getEventData, storeEvent, RootCapture } from '../core'
import { AutoCaptureProps, Persistence } from '../types'


export default class ScrollMap extends RootCapture{

  private captureScrollEventHandler: OmitThisParameter<(event: Event) => void>

  /**
   * Scroll map constructor function.
   */
  constructor({
                persistence,
                onEventCapture
              }: AutoCaptureProps) {
    super({
      persistence,
      onEventCapture
    })

    // saving the scroll event handler to be able to remove it later
    this.captureScrollEventHandler = this.captureEvent.bind(this)
  }


  /**
   * A function to start capturing the scroll events on your site.
   */
  public start(): void {
    console.log('start capturing scroll events')
    this.bindScrollEvent()
  }

  /**
   * A function to stop capturing the scroll events on your site.
   */
  public stop(): void {
    window.removeEventListener('scroll', this.captureScrollEventHandler)
  }

  /**
   * Bind scroll event to the window.
   */
  private bindScrollEvent(): void {
    window.addEventListener('scroll', this.captureScrollEventHandler)
  }

  /**
   * A function to capture the scroll events on your site.
   */
  protected captureEvent(event: Event): void {
    // getting the scroll axis
    let axis = 'y'
    if (event instanceof WheelEvent) {
      axis = event.deltaY > 0 ? 'y' : 'x'
    }

    const data = {
      ...getEventData(event, []),
      scroll: {
        scrollPercentage: this.getScrollPercentage(axis),
        scrollPosition: window.scrollY,
        windowSize: window.innerHeight,
        bodyHeight: document.body.offsetHeight,
        axis
      }
    }


    storeEvent(data, this.onEventCapture)
  }

  /**
   * A function to get the scroll percentage.
   */
  private getScrollPercentage(axis: string): number {

    const scrollPosition = axis === 'y' ? window.scrollY : window.scrollX
    const windowSize = axis === 'y' ? window.innerHeight : window.innerWidth
    const bodyHeight = axis === 'y' ? document.body.offsetHeight : document.body.offsetWidth
    return Math.round((scrollPosition / (bodyHeight - windowSize)) * 100)

  }

}
