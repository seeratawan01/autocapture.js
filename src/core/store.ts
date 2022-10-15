/**
 * Simple store to save and preserve internal state of the library
 * @class Store
 * @private
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
 */
export default class Store {
  private static instance: Store
  private store: any = {}

  private constructor() {}

  public static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store()
    }
    return Store.instance
  }

  public set(key: string, value: any): void {
    this.store[key] = value
  }

  public get(key: string): any {
    return this.store[key]
  }

  public remove(key: string): void {
    delete this.store[key]
  }

  public clear(): void {
    this.store = {}
  }

  public getAll(): any {
    return this.store
  }

  public setAll(store: any): void {
    this.store = store
  }

  public has(key: string): boolean {
    return this.store.hasOwnProperty(key)
  }

  public size(): number {
    return Object.keys(this.store).length
  }
}
