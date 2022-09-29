import { AutoCaptureProps, EventAttributes } from './types'
import { getClassName, getDirectText, getEventData } from './utils'

/**
 *  A library to provide an easiest and most comprehensive way to automatically capture the user
 *  interactions on your site, from the moment of installation forward. A single snippet grabs
 *  every click, swipe, tap, page-view, and fill — forever.
 */
export default class AutoCapture {
  private elements: Array<HTMLElement | Window | Document>
  private attributes: Array<EventAttributes>
  private debug: boolean
  private autoStart: boolean
  private autoStop: boolean
  private autoStopTimeout: number
  private autoStopTimeoutCallback: () => void
  private autoStopCallback: () => void
  private autoStartCallback: () => void
  private autoCaptureCallback: (event: Event) => boolean | void
  private autoCaptureErrorCallback: (error: Error) => void

  constructor({
                elements,
                attributes,
                debug,
                autoStart,
                autoStop,
                autoStopTimeout,
                autoStopTimeoutCallback,
                autoStopCallback,
                autoStartCallback ,
                autoCaptureCallback,
                autoCaptureErrorCallback
              }: AutoCaptureProps) {

    this.elements = elements || [document]
    this.attributes = attributes || ['text', 'className', 'value', 'type']
    this.debug = debug || false
    this.autoStart = autoStart || false
    this.autoStop = autoStop || false
    this.autoStopTimeout = autoStopTimeout || 2000
    this.autoStopTimeoutCallback = autoStopTimeoutCallback || (() => ({}))
    this.autoStopCallback = autoStopCallback || (() => ({}))
    this.autoStartCallback = autoStartCallback || (() => ({}))
    this.autoCaptureCallback = autoCaptureCallback || (() => false)
    this.autoCaptureErrorCallback = autoCaptureErrorCallback  || (() => ({}))
  }

  /**
   * A function to start capturing the user interactions (click, swipe, tap, page-view, and fill) on your site, from the moment of
   * installation forward.
   */
  public start(): void {
    console.log("start capturing user interactions")
    this.elements.forEach(element => {
      element.addEventListener('click', this.captureEvent.bind(this), true)
      element.addEventListener('change', this.captureEvent.bind(this), true)
      element.addEventListener('submit', this.captureEvent.bind(this), true)
    })
  }

  /**
   * A function to stop capturing the user interactions on your site, from the moment of installation forward.
   */
  public stop(): void {
    this.elements.forEach(element => {
      element.removeEventListener('click', this.captureEvent.bind(this), true)
      element.removeEventListener('change', this.captureEvent.bind(this), true)
      element.removeEventListener('submit', this.captureEvent.bind(this), true)
    })
  }

  /**
   * A function to capture the user interactions on your site, from the moment of installation forward.
   * @param event
   * @private
   */
  private captureEvent(event: Event): boolean | void {


    // const tagName = target.tagName.toLowerCase()
    // const type = event.type
    // const text = getDirectText(target)
    // const className = getClassName(target)
    // const value = (target as HTMLInputElement).value
    //
    const data = getEventData(event, this.attributes)

    if (this.debug) {
      console.debug(data)
    }
  }

}
