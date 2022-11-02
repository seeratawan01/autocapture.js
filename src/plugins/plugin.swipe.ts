/**
 * Plugin to detect the finger swipe event.
 * Scope:
 * - Detect swipe direction
 * - Detect swipe distance
 * - Detect swipe speed
 * @class SwipePlugin
 * @extends PluginBuilder
 * @experimental
 */
import { PluginBuilder } from '../core'
import { BindResult } from '../../types/plugin'

export default class SwipePlugin extends PluginBuilder {
  override key: string = 'swipe'
  private touchstart:any = {
    x: 0,
    y: 0
  }
  private touchend:any = {
    x: 0,
    y: 0
  }
  private fingerCount: number = 0
  private minDistance: number = 50 //Minimum distance for the swipe to work

  override bind(): BindResult[] {
    return [
      {
        name: 'swipe',
        target: window,
        event: 'touchstart',
        callback: (event: TouchEvent) => {
          return this.captureEvent(event)
        }
      },
      {
        name: 'swipe',
        target: window,
        event: 'touchend',
        callback: (event: TouchEvent) => {
          return this.captureEvent(event)
        }
      }
    ]
  }

  /**
   * A function to capture the swipe direction, distance and speed.
   * return false if the swipe is less than the minimum distance.
   * return false if the touchstart
   *
   */
  private captureEvent(event: TouchEvent): Record<string, any> | false {
    if (event.type === 'touchstart') {
      this.touchstart = {
        x: event.touches[0].pageX,
        y: event.touches[0].pageY
      }
      this.fingerCount = event.touches.length

      return false
    } else if (event.type === 'touchend') {
      this.touchend = {
        x: event.changedTouches[0].pageX,
        y: event.changedTouches[0].pageY
      }
      this.fingerCount = event.touches.length
    }

    if (this.fingerCount === 1 && this.touchend.x !== 0) {
      let x = this.touchend.x - this.touchstart.x
      let y = this.touchend.y - this.touchstart.y
      let distance = Math.sqrt(x * x + y * y)
      let direction = this.getDirection(x, y)
      let speed = this.getSpeed(distance)

      if (distance >= this.minDistance) {
        return {
          direction: direction,
          distance: distance,
          speed: speed
        }
      }
    }

    return false
  }

  /**
   * A function to get the distance of the swipe.
   * minDistance is the minimum distance for the swipe to work.
   */



  /**
   * A function to get the direction (up, down, left right) of the swipe.
   */
  private getDirection(x: number, y: number): string {
    if (Math.abs(x) > Math.abs(y)) {
      return x > 0 ? 'right' : 'left'
    } else {
      return y > 0 ? 'down' : 'up'
    }
  }


  /**
   * A function to get the speed of the swipe.
   */
  private getSpeed(distance: number): number {
    return distance / 100
  }

}
