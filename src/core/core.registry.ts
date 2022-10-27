/**
 * Module to register plugins to extend the functionality of the core.
 * @class PluginRegistry
 * @example
 * // To register a plugin:
 * PluginRegistry.register('scrollMap', scrollMap)
 * // To get a plugin:
 * PluginRegistry.get('scrollMap')
 * // To unregister a plugin:
 * PluginRegistry.unregister('scrollMap')
 *
 */
import { Plugin } from '../../types'

export default class PluginRegistry {
  /**
   * The plugin registry.
   */
  private static registry: Record<string, Plugin> = {}


  /**
   * Register a plugin.
   */
  static register(plugin: Plugin): void {
    PluginRegistry.registry[plugin.key] = plugin
  }

  /**
   * Unregister a plugin.
   */
  static unregister(name: string): void {
    delete PluginRegistry.registry[name]
  }

  /**
   * Get a plugin.
   */
  static get(name: string): Plugin {
    return PluginRegistry.registry[name]
  }

  /**
   * Get all plugins.
   */
  static getAll(): Record<string, Plugin> {
    return PluginRegistry.registry
  }
}
