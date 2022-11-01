/**
 * Internal page view plugin to add page view functionality to the core. Functionality includes:
 * - Capture the page view
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
      {
        name: 'page-view',
        target: window,
        event: 'popstate',
        callback: () => {
          return ({})
        }
      },
      {
        name: 'page-view',
        target: window,
        event: 'load',
        callback: () => {
          return ({})
        },
      },
    ]
  }
}
