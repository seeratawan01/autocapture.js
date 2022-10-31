import { BaseOptions, Plugin } from '../../types'

/**
 * Plugin builder
 *
 */
export default class PluginBuilder  implements Plugin {
  key: string = ''
  private options: Record<string, any> = {}
  
  bind(_: BaseOptions): Record<"target" | "type" | "handler" | "options", any> {
    return undefined;
  }

  onBeforeCapture(_: Event): boolean {
    return true;
  }

  onEventCapture(_: Record<string, any>): void {
  }

  onInit(options: BaseOptions): void {
    this.options = options
  }

  onStart(): void {

  }

  onStop(): void {

  }

  getOptions(): Record<string, any> {
    return this.options
  }
}
