/**
 * Internal mouse movement plugin to add mouse movement functionality to the core.
 * Scope:
 * - Capture the mouse movement
 * @extends PluginBuilder
 */
import { BaseOptions, BindResult } from '../../types'
import { PluginBuilder } from '../core'

export default class MouseMovementPlugin extends PluginBuilder {
  override key: string = 'mouse-movement'

  override bind(_: BaseOptions): BindResult[] {

    return [
      {
        name: 'mouse-movement',
        target: window,
        event: 'mousemove',
        callback: (event: MouseEvent) => {
          return this.captureEvent(event)
        },
        throttle: 100
      }
    ]
  }

  /**
   * A function to capture the mouse movement events on your site.
   */
  private captureEvent(event: MouseEvent): Record<string, any> {

    return {
      x: event.clientX,
      y: event.clientY
    }
  }


}
