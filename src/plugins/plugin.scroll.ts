/**
 * Internal scroll plugin to add scroll functionality to the core, functionalities include:
 * - Capture the exact percentage of the page scrolled.
 * @class Scroll
 * @extends Plugin
 */

import { Plugin } from '../types'

export default class Scroll implements Plugin{

  key: string = 'scroll'

  constructor() {
    // saving the scroll event handler to be able to remove it later
    this.captureEvent = this.captureEvent.bind(this)
  }


  /**
   * A function to capture the scroll events on your site.
   */
  public captureEvent(event: Event): boolean | void {
    console.log('scroll event captured', event)

    
  }

  /**
   * A function to start capturing the scroll events on your site.
   */
  start(): void {
    this.bindScrollEvent()
  }

  /**
   * A function to stop capturing the scroll events on your site.
   */
  stop(): void {
    window.removeEventListener('scroll', this.captureEvent)
  }

  /**
   * Bind scroll event to the window.
   */
  bindScrollEvent(): void {
    window.addEventListener('scroll', this.captureEvent)
  }


}
