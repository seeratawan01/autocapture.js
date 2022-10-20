/**
 *  A library to provide an easiest and most comprehensive way to automatically capture the user
 *  interactions on your site, from the moment of installation forward. A single snippet grabs
 *  every click, swipe, tap, page-view, and fill — forever.
 */
import { Base, DOMEvent, JSON } from './core'

import { BaseOptions, Capture, Attributes } from '../types'
import { DEFAULT_OPTIONS } from './constant'
import { shouldCaptureEvent, prepareEventPayload, storePayload } from './helpers'

export class AutoCapture extends Base {
  private elements: string[]
  private attributes: Array<Attributes>
  private safelist: Array<string>
  private capturable: Capture[]

  /**
   * Constructor for the AutoCapture class.
   * @param options - The options to use for the AutoCapture instance.
   * @param options.elements - A list of elements to capture events from. Defaults to ['a', 'button', 'form', 'input', 'select', 'textarea', 'label'].
   * @param options.attributes - A list of attributes to capture from the event target. Defaults to `['text', 'className', 'value', 'type', 'tagName', 'href', 'src', 'id', 'name', 'placeholder', 'title', 'alt', 'role']`.
   * @param options.safelist - A list of selectors to ignore to avoid capturing any sensitive data. Defaults to `[]`.
   * @param options.capture - A list of events to capture. Defaults to `['click', 'change', 'submit']`.
   * @param options.X - A Callback function fires on captured event stored.
   * @param options.persistence - A string to set the persistence method. Defaults to `memory`.
   * @public
   * @constructor
   */
  constructor({
                elements = DEFAULT_OPTIONS.ELEMENTS,
                attributes = DEFAULT_OPTIONS.ATTRIBUTES,
                safelist = DEFAULT_OPTIONS.SAFELIST,
                capture = DEFAULT_OPTIONS.CAPTURE,
                ...options
              }: BaseOptions) {
    super(options)

    // Default Values
    this.elements = elements
    this.safelist = safelist
    this.attributes = attributes
    this.capturable = capture

    // save the event handler, so it can be used in multiple places
    this.captureEvent = this.captureEvent.bind(this)

    // start capturing the user interactions
    this.start()
  }

  /**
   * start capturing the user interactions (click, swipe, tap, page-view, and fill) on the site.
   * @public
   */
  start(): void {
    // Capture events
    this.bind()

    // Send current path
  }
  /**
   * Stop capturing events.
   */
  stop(): void {
    this.unbind()
  }

  /**
   * Bind the event listener to the elements using the DOMEvent class.
   */
  bind(): void {
    //  Capture DOM events on every elements
    if (this.capturable.length) {
      this.capturable.includes('click') && new DOMEvent('click', this.captureEvent).bind()
      this.capturable.includes('double-click') && new DOMEvent('dblclick', this.captureEvent).bind()
      this.capturable.includes('context-menu') && new DOMEvent('contextmenu', this.captureEvent).bind()
      this.capturable.includes('input') && new DOMEvent('input', this.captureEvent).bind()
      this.capturable.includes('change') && new DOMEvent('change', this.captureEvent).bind()
      this.capturable.includes('submit') && new DOMEvent('submit', this.captureEvent).bind()
      this.capturable.includes('touch') && new DOMEvent('touchstart', this.captureEvent).bind()
      this.capturable.includes('touch') && new DOMEvent('touchend', this.captureEvent).bind()
      this.capturable.includes('touch') && new DOMEvent('touchcancel', this.captureEvent).bind()
    }

    // Capture page view event
    this.capturable.includes('page-view') && new DOMEvent('popstate', this.captureEvent, {}, window).bind()
    this.capturable.includes('page-view') && new DOMEvent('load', this.captureEvent, {}, window).bind()
  }

  /**
   * Unbind the event listeners.
   */
  unbind(): void {
    DOMEvent.purge()
  }

  /**
   * The function to capture the event.
   */
  protected captureEvent(event: Event): void {

    // Check if the event is for page view
    if (event.type === 'popstate' || event.type === 'load') {
      this.capturePageView(event)
      return;
    }

    // Skip the event if the target is not in the elements list
    if (!shouldCaptureEvent(this.elements, event)) {
      return;
    }


    // Skip the event if the target is in the safe list selector
    if (this.safelist.some(selector => (event.target as HTMLElement).matches(selector))) {
      return;
    }

    // Extracting the data from the event attributes
    const payload = prepareEventPayload(event, {
      attributes: this.attributes,
      sessionId: this.sessionId,
      payload: this.payload,
      type: event.type,
    })

    if (storePayload(payload)) {
      this.onEventCapture(payload)
    }
  }

  /**
   * The function to capture the page view event.
   */
  private capturePageView(event: Event): void {
    // Extracting the data from the event attributes
    const payload = prepareEventPayload(event, {
      attributes: this.attributes,
      sessionId: this.sessionId,
      payload: this.payload,
      type: 'page-view',
    })

    // const payload = {
    //   type: 'page-view',
    //   sessionId: this.sessionId,
    //   payload: this.payload,
    //   data: {
    //     url: window.location.href,
    //     title: document.title,
    //     referrer: document.referrer,
    //   },
    // }
    if (storePayload(payload)) {
      this.onEventCapture(payload)
    }
  }

  /**
   * The function to get all the captured events from storage.
   * @public
   * @returns {JSON[]} - An array of JSON objects.
   */
  public getCapturedEvents(): any[]  {
    let events  = this.persistence?.getItem(DEFAULT_OPTIONS.STORAGE_KEY)
    return events ? JSON.parse(events) : []
  }

}

