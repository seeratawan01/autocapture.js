/**
 * This is a template for a plugin creation to extend the functionality of the core. The plugin will be in touch with every lifecycle of the core.
 */
import { BaseOptions, Plugin } from '../../types'

export class ExamplePlugin implements Plugin {
  key: string = 'example'
  options: Record<string, any> = {}

  bind(_: BaseOptions): Record<'target'|'type'|'handler'|'options', any> {
    return {
      target: document,
      type: 'scroll',
      handler: (event: Event, payload: Record<string, any>) => {
        console.log('ExamplePlugin handler:', event, payload)
        return {
          'test': '123'
        }
      },
      options: true
    }
  }

  onInit(options: BaseOptions): void {
    console.log('ExamplePlugin initialized with options:', options)
    this.options = options
  }

  onStart(): void {
    console.log('ExamplePlugin started')
  }

  onStop(): void {
    console.log('ExamplePlugin stopped')
  }

  onBeforeCapture(event: Event): boolean {
    console.log('ExamplePlugin before capturing event:', event)
    return true
  }

  onEventCapture(eventData: Record<string, any>): void {
    console.log('ExamplePlugin captured event:', eventData)
  }

}
