/**
 * Scroll maps show you the exact percentage of people who scroll down to any point on the page: the redder the area, the more visitors saw it.
 */
import { getEventData, storeEvent, RootCapture } from '../core'
import { AutoCaptureProps, Persistence } from '../types'


export default class ScrollMap extends RootCapture{

  private captureScrollEventHandler: OmitThisParameter<(event: Event) => void>
  private lastScrollTop = 0

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
    // getting the scroll direction
    let direction = this.getScrollDirection()

    const data = {
      ...getEventData(event, []),
      scroll: {
        scrollPercentage: this.getScrollPercentage(direction),
        scrollPosition: window.scrollY,
        windowSize: window.innerHeight,
        bodyHeight: document.body.offsetHeight,
        direction
      }
    }


    storeEvent(data, this.onEventCapture)
  }

  /**
   * A function to get the scroll percentage based on the scroll direction.
   */
  private getScrollPercentage(direction: string): number {
    if (direction === 'y') {
      return Math.floor(window.scrollY / (document.body.offsetHeight - window.innerHeight) * 100)
    }
    return Math.floor((window.scrollX / (document.body.offsetWidth - window.innerWidth)) * 100)
  }

  /**
   * A function to get the scroll direction.
   */
  private getScrollDirection(): string {
    const scrollTop = window.scrollY
    let direction = 'y'
    if (scrollTop > this.lastScrollTop) {
      direction = 'y'
    } else {
      direction = 'x'
    }
    this.lastScrollTop = scrollTop
    return direction
  }

}
