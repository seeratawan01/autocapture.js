import { Store } from './index'


/**
 * Module to persist data in the browser's local storage, session storage or memory.
 * This module is used to persist the captured events.
 * Local storage - The events are stored in the browser's local storage and are available after the page is refreshed.
 * Session storage - The events are stored in the browser's session storage and are available after the page is refreshed.
 * Memory - The events are stored in memory and are lost when the page is refreshed And this module use Store module to store the events in memory.
 * @class Persistence
 * @example
 * // To persist the captured events in the browser's local storage:
 * const persistence = new Persistence('localStorage')
 *
 * persistence.set('key', 'value')
 * persistence.get('key')
 * persistence.remove('key')
 * persistence.clear()
 * persistence.getAll()
 * persistence.setAll({key: 'value'})
 * persistence.has('key')
 * persistence.size()
 * ...
 */
export class Persistence implements Storage{
  /**
   * The storage object to use for persistence.
   */
  storage: Storage

  constructor(persistence: string) {
    if (persistence === 'localStorage' || persistence === 'sessionStorage') {
      this.storage = window[persistence]
    } else {
      this.storage = Store.getInstance()
    }
  }

  /**
   * Returns the number of key/value pairs.
   */
  get length (): number {
    return this.storage.length
  }

  /**
   * Set a key-value pair in the storage.
   */
  setItem(key: string, value: any): void {
    this.storage.setItem(key, JSON.stringify(value))
  }

  /**
   * Get a value from the storage.
   */
  getItem(key: string): any {
    return JSON.parse(this.storage.getItem(key))
  }

  /**
   * Remove a key-value pair from the storage.
   */
  removeItem(key: string): void {
    this.storage.removeItem(key)
  }

  /**
   * Clear the storage.
   */
  clear(): void {
    this.storage.clear()
  }

  /**
   * Get all the key-value pairs from the storage.
   */
  getAll(): any {
    const store = {}
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i)
      store[key] = this.getItem(key)
    }
    return store
  }

  /**
   * Set all the key-value pairs in the storage.
   */
  setAll(store: any): void {
    this.clear()
    for (const key in store) {
      this.setItem(key, store[key])
    }
  }

  /**
   * Check if a key exists in the storage.
   */
  has(key: string): boolean {
    return this.storage.getItem(key) !== null
  }

  /**
   * Get the size of the storage.
   */
  size(): number {
    return this.storage.length
  }

  /**
   * Get the key at a given index.
   */
  key(index: number): string {
    return this.storage.key(index)
  }

  /**
   * Get the storage object.
   */
  getStorage(): Storage {
    return this.storage
  }

}
