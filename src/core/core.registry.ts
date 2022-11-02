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
import { BindResult, Plugin } from '../../types'

export default class PluginRegistry {
  /**
   * The plugin registry.
   */
  private static registry: Plugin[] = []


  /**
   * Register a plugin.
   */
  static register(plugin: Plugin): void {
    PluginRegistry.registry.push(plugin)
  }

  /**
   * Unregister a plugin.
   */
  static unregister(name: string): void {
    PluginRegistry.registry = PluginRegistry.registry.filter(plugin => plugin.key !== name)
  }

  /**
   * Get a plugin.
   */
  static get(name: string): Plugin {
    return PluginRegistry.registry.find(plugin => plugin.key === name)
  }

  /**
   * Get all plugins.
   */
  static getAll(): Plugin[] {
    return PluginRegistry.registry
  }

  /**
   * Call the bind method of a plugin.
   */
  static bind(name: string, options: Record<string, any>): BindResult[] {
    return PluginRegistry.get(name).bind(options)
  }

  /**
   * Check if a plugin is registered.
   */
  static has(name: string): boolean {
    return !!PluginRegistry.get(name)
  }
}
