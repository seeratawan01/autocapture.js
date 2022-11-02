/**
 * Plugin to add taps (on touch devices) or clicks (on desktop) to the core.
 * Scope:
 * - Capture the tap/click events
 * @extends PluginBuilder
 */
import { BaseOptions } from '../../types'
import { PluginBuilder } from '../core'
import { BindResult } from '../../types/plugin'
import { shouldCaptureEvent } from '../helpers'

export default class TapPlugin extends PluginBuilder {
  override key: string = 'tap'

  override bind(options: BaseOptions): BindResult[] {
    return [
      {
        name: 'click',
        target: document,
        event: 'click',
        callback: (event: Event) => {
          return this.captureEvent(event, options)
        },
        options: {
          capture: true
        },
        condition: () => {
          return !('ontouchstart' in window)
        }
      },
      {
        name: 'click',
        target: document,
        event: 'dblclick',
        callback: (event: Event) => {
          return this.captureEvent(event, options)
        },
        options: {
          capture: true
        },
        condition: () => {
          return !('ontouchstart' in window)
        }
      },
      {
        name: 'click',
        target: document,
        event: 'contextmenu',
        callback: (event: Event) => {
          return this.captureEvent(event, options)
        },
        options: {
          capture: true
        }
      },
      {
        name: 'tap',
        target: document,
        event: 'touchstart',
        callback: (event: Event) => {
          return this.captureEvent(event, options)
        },
        options: {
          capture: true
        }
      }
    ]
  }

  /**
   * A function to capture the tap/click event.
   */
  private captureEvent(event: Event, options: BaseOptions): Record<string, any> | false {
    const { elements, safelist } = options

    // Skip the event if the target is not in the elements list
    if (!shouldCaptureEvent(elements, event)) {
      return false
    }

    // Skip the event if the target is in the safe list selector
    if (safelist.some(selector => (event.target as HTMLElement).matches(selector))) {
      return false
    }

    // Determine the type of the event.
    const eventType = event.type === 'touchstart' ? 'tap' : event.type

    return {
      detail: {
        type: eventType,
        x: (event as any).clientX,
        y: (event as any).clientY
      }
    }

  }

}
