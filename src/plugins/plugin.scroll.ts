import { BaseOptions } from '../types'
import { PluginBuilder } from '../core'
import { BindResult } from '../../types'


/**
 * Internal scroll plugin to add scroll functionality to the core, functionalities include:
 * - Capture the exact percentage of the page scrolled.
 * - Capture the x and y scroll depth.
 * - Capture the scroll direction (up, down).
 * - Capture the scroll speed.
 * - Capture the scroll position.
 * - Capture the scroll height.
 * @extends PluginBuilder
 */
class ScrollPlugin extends PluginBuilder {
  override key: string = 'scroll'

  lastScrollTop: number = 0

  override bind(_: BaseOptions): BindResult[] {
    return [
      {
        name: 'scroll',
        target: window,
        event: 'scroll',
        callback: () => {
          return this.captureEvent()
        },
        options: true
      }
    ]
  }

  /**
   * A function to capture the scroll events on your site.
   */
  private captureEvent(): Record<string, any> {

    // getting the scroll direction
    const direction = this.getScrollDirection()

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

    return {
      details: payload
    }

  }

  /**
   * A function to get the scroll direction.
   */
  private getScrollDirection = (): string => {

    const st = window.pageYOffset || document.documentElement.scrollTop
    if (st > this.lastScrollTop) {
      this.lastScrollTop = st
      return 'down'
    }
    this.lastScrollTop = st <= 0 ? 0 : st // For Mobile or negative scrolling

    return 'up'
  }

}

export default ScrollPlugin
