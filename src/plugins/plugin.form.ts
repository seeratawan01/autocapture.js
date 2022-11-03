/**
 * Plugin to add form functionality to the core.
 * Scope:
 * - Capture the input events
 * - Capture the change events
 * - Capture the form submit events
 * - Capture the form reset events
 * @extends PluginBuilder
 */
import { BaseOptions, BindResult } from '../../types'
import { PluginBuilder } from '../core'
import { shouldCaptureEvent } from '../helpers'

export default class FormPlugin extends PluginBuilder {
  override key: string = 'form'

  override bind(options: BaseOptions): BindResult[] {
    return [
      {
        name: 'form',
        target: document,
        event: 'submit',
        callback: (event: Event) => {
          return this.captureEvent(event, options)
        }
      },
      {
        name: 'form',
        target: document,
        event: 'reset',
        callback: (event: Event) => {
          return this.captureEvent(event, options)
        }
      },
      {
        name: 'form',
        target: document,
        event: 'input',
        callback: (event: Event) => {
          return this.captureEvent(event, options)
        }
      },
      {
        name: 'form',
        target: document,
        event: 'change',
        callback: (event: Event) => {
          return this.captureEvent(event, options)
        }
      }
    ]
  }

  /**
   * A function to capture the form events on your site.
   */
  private captureEvent(event: Event, options: BaseOptions): Record<string, any> | false {
    const {elements, safelist} = options

    // Skip the event if the target is not in the elements list
    if (!shouldCaptureEvent(elements, event)) {
      return false;
    }

    // Skip the event if the target is in the safe list selector
    if (safelist.some(selector => (event.target as HTMLElement).matches(selector))) {
      return false;
    }

    const target = event.target as HTMLInputElement

    let formData: Record<string, any> = {}
    if (target.form) {
      formData = {
        action: target.form?.action,
        method: target.form?.method,
        id: target.form?.id,
        name: target.form?.name,
      }
    }

    return {
      type: event.type,
      ...formData
    }
  }
}
