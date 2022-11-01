/**
 * Module to provide event handling functionality for all DOM Events.
 * With the help of this module, we can capture any event emitted by the browser.
 * @class DOMEvent
 * @example
 * // To capture the click event:
 * const event = new DOMEvent('click')
 * event.capture()
 */
export default class DOMEvent {
  /**
   * The event name.
   */
  private name: keyof WindowEventMap | string

  /**
   * The event handler.
   * @param event of type Event or any of its subclasses.
   */
  private handler: (event: Event) => void

  /**
   * The event options.
   */

  private options?: boolean | AddEventListenerOptions

  /**
   * Target element to bind an event.
   */
  private target: HTMLElement | Document | Window = document

  /**
   * List of all bound event listeners.
   */
  // static instances: DOMEvent[] = []


  /**
   * The event constructor.
   * @param name The event name.
   * @param handler The event handler.
   * @param options The event options.
   * @param target The target element to bind the event listener to.
   * @public
   */
  constructor(name: keyof WindowEventMap | string, handler: (event: Event) => void, options: boolean | AddEventListenerOptions = {}, target?: HTMLElement | Document | Window) {
    this.name = name
    this.handler = handler
    this.options = options
    if (target) this.target = target

    // if (!DOMEvent.instances.includes(this)) {
    //   DOMEvent.instances.push(this)
    // }
  }

  /**
   * Call the event handler to capture an event.
   * @public
   * @return DOMEvent
   */
  public bind(): DOMEvent {
    this.target.addEventListener(this.name, this.handler, this.options)
    return this;
  }

  /**
   * Stop capturing an event.
   * @public
   * @return DOMEvent
   */
  unbind() {
    this.target.removeEventListener(this.name, this.handler, this.options)
    return this
  }

  /**
   * Purge all the event listeners.
   * @public
   * @static
   * @return void
   */
  // public static purge() {
  //   DOMEvent.instances.forEach((instance) => instance.unbind())
  //   DOMEvent.instances = []
  // }

}
