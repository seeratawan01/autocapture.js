/**
 * Internal mouse movement plugin to add mouse movement functionality to the core. Functionality includes:
 * - Capture the mouse movement
 * @extends PluginBuilder
 * @internal
 */
import { BaseOptions } from '../../types'
import { PluginBuilder } from '../core'
import { BindResult } from '../../types/plugin'

export default class MouseMovementPlugin extends PluginBuilder {
  override key: string = 'mouse-movement-internal'

  override bind(_: BaseOptions): BindResult[] {
    return [
      {
        name: 'mouse-movement',
        target: window,
        type: 'mousemove',
        handler: (event: MouseEvent) => {
          return this.captureEvent(event)
        },
        options: {},
        throttling: 100
      },
    ]
  }

  /**
   * A function to capture the mouse movement events on your site.
   */
  private captureEvent(event: MouseEvent): Record<string, any> {

    return {
      coordinates: {
        x: event.clientX,
        y: event.clientY,
      }
    }
  }
}
