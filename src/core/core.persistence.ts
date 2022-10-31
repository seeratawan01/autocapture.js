import Store from './core.store'
import { PersistenceType } from '../types'
import { DEFAULT_OPTIONS } from '../constant'

/**
 * Module to persist capture events in the browser's local storage, session storage or memory.
 * @class Persistence
 * @example
 * // To persist the captured events in the browser's memory:
 * const persistence = Persistence.getInstance('memory')
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
export default class Persistence implements Storage{

  /**
   * The storage object.
   * @private
   */
  private static instance: Persistence = null

  /**
   * The storage object to use for persistence.
   */
  storage: Storage


  /**
   * Returns the instance of this class.
   * @param persistence - The type of persistence to use.
   * @returns {Persistence} The instance of this class.
   */
  public static getInstance(persistence: PersistenceType = DEFAULT_OPTIONS.PERSISTENCE, maxLimit = DEFAULT_OPTIONS.MAX_EVENTS): Storage {

    if (!Persistence.instance) {
      console.log('new persistence instance', persistence, maxLimit)
      Persistence.instance = new Persistence(persistence)
    }

    return Persistence.instance.storage
  }

  private constructor(persistence: PersistenceType) {
    if (persistence === 'localStorage' || persistence === 'sessionStorage') {
      this.storage = window[persistence]
    } else if (persistence === 'memory') {
      this.storage = Store.getInstance()
    } else if (persistence === 'none') {
      this.storage = null
    } else {
      throw new Error('Invalid persistence type')
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
  setItem(key: string, value: string): void {
    this.storage.setItem(key, value)
  }

  /**
   * Get a value from the storage.
   */
  getItem(key: string): any {
    return this.storage.getItem(key)
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


}
