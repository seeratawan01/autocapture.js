/**
 * Internal page view plugin to add page view functionality to the core.
 */
import { BaseOptions } from '../../types'
import { PluginBuilder } from '../core'

export default class PageViewPlugin extends PluginBuilder {
  override key: string = 'page-view-internal'

  override bind(_: BaseOptions): Record<'target' | 'type' | 'handler' | 'options' | 'name', any>[] {
    return [
      {
        name: 'page-view',
        target: window,
        type: 'popstate',
        handler: () => {
          return ({})
        },
        options: {}
      },
      {
        name: 'page-view',
        target: window,
        type: 'load',
        handler: () => {
          return ({})
        },
        options: {}
      },
    ]
  }
}
