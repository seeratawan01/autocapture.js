import { BaseOptions, Plugin } from '../types'
import { storePayload } from '../helpers'
import { DOMEvent } from '../core'

interface ScrollPlugin extends Plugin {
  lastScrollTop: number
  getScrollDirection?: () => string,
}

/**
 * Internal scroll plugin to add scroll functionality to the core, functionalities include:
 * - Capture the exact percentage of the page scrolled.
 * - Capture the x and y scroll depth.
 * @implements {Plugin}
 */
const Scroll: ScrollPlugin = {

  key: 'scroll',

  lastScrollTop: 0,

  onEventCapture: (e) => e,
  /**
   * A function to capture the scroll events on your site.
   * - Capture the exact percentage of the page scrolled.
   * - Capture the x and y scroll depth.
   * - Capture the scroll direction (up, down).
   * - Capture the scroll speed.
   * - Capture the scroll position.
   * - Capture the scroll height.
   */
  captureEvent(): boolean | void {

    console.log('scroll captureEvent')

    // getting the scroll direction
    const direction = Scroll.getScrollDirection()

    // getting the scroll depth
    const scrollDepth = {
      x: window.scrollX,
      y: window.scrollY
    }

    // getting the scroll percentage
    const scrollPercentage = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100

    // getting the scroll position
    const scrollPosition = {
      x: window.scrollX / (document.body.scrollWidth - window.innerWidth),
      y: window.scrollY / (document.body.scrollHeight - window.innerHeight)
    }

    // getting the scroll speed
    const scrollSpeed = {
      x: window.scrollX - window.scrollX,
      y: window.scrollY - window.scrollY
    }

    // getting the scroll size
    const scrollSize = {
      x: document.body.scrollWidth - window.innerWidth,
      y: document.body.scrollHeight - window.innerHeight
    }

    // getting the scroll viewport
    const scrollViewport = {
      x: window.innerWidth,
      y: window.innerHeight
    }

    // setting the scroll data
    const payload = {
      direction,
      depth: scrollDepth,
      percentage: scrollPercentage,
      position: scrollPosition,
      speed: scrollSpeed,
      size: scrollSize,
      viewport: scrollViewport
    }

    console.log('scroll data', payload)

    // storing the scroll data
    if (storePayload(payload)) {
      Scroll.onEventCapture(payload)
    }
  },

  /**
   * A function to start capturing the scroll events on your site.
   */
  start({ onEventCapture }: BaseOptions): void {
    console.log('scroll plugin started')
    this.onEventCapture = onEventCapture || this.onEventCapture
    this.eventInstance = new DOMEvent('scroll', this.captureEvent, {}, window).bind()
  },

  /**
   * A function to stop capturing the scroll events on your site.
   */
  stop(): void {
    this.eventInstance.unbind()
  },

  /**
   * Get the scroll direction.
   * Capture the scroll direction (up, down).
   * @returns {string} - The scroll direction.
   */
  getScrollDirection(): string {

    const st = window.pageYOffset || document.documentElement.scrollTop
    if (st > this.lastScrollTop) {
      this.lastScrollTop = st
      return 'down'
    }
    this.lastScrollTop =  st <= 0 ? 0 : st; // For Mobile or negative scrolling

    return 'up'
  }

}

export default Scroll
