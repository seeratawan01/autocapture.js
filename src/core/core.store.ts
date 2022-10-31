/**
 * Module to provide memory storage functionality.
 * API exposed by the memory storage are made similar to the API of the browser's local storage and session storage to make it easy to switch other persistence methods.
 * @class Store
 * @example
 * const store = Store.getInstance()
 * store.set('key', 'value')
 * store.get('key')
 * store.remove('key')
 * store.clear()
 * store.getAll()
 * store.setAll({key: 'value'})
 * store.has('key')
 * store.size()
 * ...
 */
import JSON from './core.json'

export default class Store implements Storage {
  private static instance: Store
  private store: any = {}

  /**
   * The private constructor of the Store class. This constructor is private to prevent the creation of multiple instances of the Store class.
   * The singleton pattern is used to create the instance of the Store class.
   * @constructor
   * @private
   */
  private constructor() {}

  /**
   * Returns the instance of the Store class.
   * @returns {Store} The instance of the Store class.
   */
  public static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store()
    }
    return Store.instance
  }

  /**
   * Returns the number of key/value pairs.
   */
  get length(): number {
    return this.size()
  }

  /**
   * Set a key-value pair in the storage.
   * @param key
   * @param value
   */
  public setItem(key: string, value: any): void {
    // console.log('setItem', JSON.isJSON(value))
    if (JSON.isJSON(value)) {
      value = JSON.parse(value)
    }

    this.store[key] = value
  }

  /**
   * Get a value from the storage.
   * @param key
   */
  public getItem(key: string): any {
    return this.store[key]
  }

  /**
   * Remove a key-value pair from the storage.
   * @param key
   */
  public removeItem(key: string): void {
    delete this.store[key]
  }

  /**
   * Clear the storage.
   */
  public clear(): void {
    this.store = {}
  }

  /**
   * Returns the key at the given index.
   * @param index
   */
  public key(index: number): string {
    return Object.keys(this.store)[index]
  }

  /**
   * Returns all the key-value pairs.
   */
  public getAll(): any {
    return this.store
  }

  /**
   * Set all the key-value pairs.
   * @param store
   */
  public setAll(store: any): void {
    this.store = store
  }

  /**
   * Returns true if the key exists in the storage.
   * @param key
   */
  public has(key: string): boolean {
    return this.store.hasOwnProperty(key)
  }

  /**
   * Returns the number of key-value pairs.
   */
  public size(): number {
    return Object.keys(this.store).length
  }
}
