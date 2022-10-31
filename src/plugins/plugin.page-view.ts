/**
 * Internal page view plugin to add page view functionality to the core.
 */
import { BaseOptions } from '../../types'
import { PluginBuilder } from '../core'

export class PageViewPlugin extends PluginBuilder {
  override key: string = 'page-view'

  override bind(_: BaseOptions): Record<'target' | 'type' | 'handler' | 'options', any> {
    return {
      target: window,
      type: 'load',
      handler: () => {
        return this.captureEvent()
      },
      options: true
    }
  }

  /**
   * A function to capture the page view events on your site.
   */
  private captureEvent(): Record<string, any> {
    return {
      event: 'page-view',
      data: {
        url: window.location.href,
        referrer: document.referrer,
        title: document.title
      }
    }
  }
}
