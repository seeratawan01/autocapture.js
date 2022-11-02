/**
 * The plugin to capture the events when the user first visits the page and when the user leaves the page.
 * Scope:
 * - First time page load
 * - When page unload
 * - Browser history change
 * @extends PluginBuilder
 * @internal
 */
import { BaseOptions } from '../../types'
import { PluginBuilder } from '../core'
import { BindResult } from '../../types/plugin'

export default class PageViewPlugin extends PluginBuilder {
  override key: string = 'page-view-internal'

  override bind(_: BaseOptions): BindResult[] {
    return [
     // Detect when the user first visits the page on first load
      {
        name: 'page',
        target: window,
        event: 'load',
        callback: () => {
          return this.captureEvent('load')
        },
        options: {
          once: true,
          capture: true
        }
      },
      // Detect when the user leaves the page
      {
        name: 'page',
        target: window,
        event: 'beforeunload',
        callback: () => {
          return this.captureEvent('leave')
        }
      },
      // Detect when the history state changes
      {
        name: 'page',
        target: window,
        event: 'popstate',
        callback: () => {
          return this.captureEvent('change')
        },
        options: {
          capture: true
        }
      }
    ]
  }

  /**
   * A function to capture the page view events on your site.
   */
  private captureEvent(state: string): Record<string, any> {
    return {
      details: {
        state
      }
    }
  }
}
