/**
 * The plugin to capture the events when the user first visits the page and when the user leaves the page.
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
     // Detect when the user leaves the page using visibilitychange event
      {
        name: 'page-view',
        target: document,
        event: 'visibilitychange',
        callback: () => {
          return this.captureEvent()
        }
      }
    ]
  }

  /**
   * A function to capture the page view events on your site.
   */
  private captureEvent(): Record<string, any> {
    return {
      state: document.visibilityState
    }
  }
}
