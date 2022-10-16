import { EventAttributes, Persistence } from '../types'
import { STORAGE_KEY, VISITOR_ID_KEY } from '../constant'
import RootCapture from './rootCapture'
import Store from './store'
import JSON from './json'
// In-memory storage for managing internal states
const store = Store.getInstance()

/**
 * Get the className of an element, accounting for edge cases where element.className is an object
 * @param {Element} el - element to get the className of
 * @returns {string} the element's class
 */
export function getClassName(el: Element): string {
  if ((el.className as any) instanceof SVGAnimatedString) {
    return (el.className as any)?.baseVal || ''
  }
  return el.className
}

/**
 * Get the direct text content of an element, protecting against sensitive data collection.
 * Concats textContent of each of the element's text node children; this avoids potential
 * collection of sensitive data that could happen if we used element.textContent and the
 * element had sensitive child elements, since element.textContent includes child content.
 * Scrubs values that look like they could be sensitive (i.e. cc or ssn number).
 * @param {Element} el - element to get the text of
 * @returns {string} the element's direct text content
 */
export function getDirectText(el: Element): string {
  const textNodes = Array.from(el.childNodes).filter(node => node.nodeType === Node.TEXT_NODE)
  const text = textNodes.map(node => node.textContent).join('')
  return scrubText(text)
}

export function scrubText(text: string): string {
  return text.replace(/[^0-9a-zA-Z]/g, '')
}

/**
 * Get the data from the captured page-view event according to given attributes and structure it for the API
 */
export function getPageViewData(): Record<string, any> {
  const data: Record<string, any> = {
    type: 'page-view',
    timestamp: new Date().getTime(),
    page: window.location.href,
    referrer: document.referrer
  }

  // Add meta data
  data.meta = getMetaData()

  // Add extensions visitor related data
  data.session = getSessionData()

  return data
}

/**
 * Get the data from the captured event according to given attributes and structure it for the API
 */
export function getEventData(
  event: Event,
  attributes: Array<EventAttributes>
): Record<string, any> {

  const target = getEventTarget(event)
  const data: Record<string, any> = {
    event: event.type
  }
  if (!target) {
    return data
  }
  data.attributes = {}
  attributes.forEach(attribute => {
    const value = getEventTargetValue(event, attribute)
    if (value) {
      data.attributes[attribute] = value
    }
  })

  // Add extensions data for form events
  if (target instanceof HTMLFormElement) {
    data.form = {
      name: target.name,
      id: target.id,
      method: target.method,
      action: target.action
    }
  }

  // Add extensions data for mouse events
  if (event instanceof MouseEvent) {
    data.mouse = getMouseEventCoordinates(event)
  }

  // Add extensions data for touch events (only the first touch)
  if (event instanceof Event && event.type.startsWith('touch')) {
    data.touch = getTouchEventCoordinates(event)
  }

  // Add extensions data for input events
  if (event instanceof Event && event.type.startsWith('input')) {
    data.input = getInputEventValue(event)
  }

  // Add meta data
  data.meta = getMetaData()

  // Add extensions data for error events (not tested)
  if (event instanceof ErrorEvent) {
    data.error = {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    }
  }

  // Add extensions session related data
  data.session = getSessionData()

  return data
}

/**
 * Get the input event value
 */
export function getInputEventValue(event: Event): Record<string, any> {
  const target = getEventTarget(event)
  return {
    value: (target as HTMLInputElement).value
  }
}

/**
 * Get Session related data from the captured event
 */
export function getSessionData(): Record<string, any> {
  return {
    id: getVisitorId()
  }
}

/**
 * Get Meta data from the captured event
 */
export function getMetaData(): Record<string, any> {
  return {
    scrollDepth: getScrollDepth(),
    timestamp: Date.now(),
    timezone: new Date().getTimezoneOffset(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    referrer: document.referrer,
    screen: {
      width: window.screen.width,
      height: window.screen.height
    },
    window: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    devicePixelRatio: window.devicePixelRatio,
    isMobile: isMobile(),
    isTouch: isTouchDevice(),
    isBot: isBot()
  }
}

/**
 * Get Event coordinates relative to the viewport
 */
export function getTouchEventCoordinates(event: Event): Record<string, any> {
  const touch = (event as TouchEvent).touches[0]
  if (touch) {
    return {
      x: touch.clientX,
      y: touch.clientY
    }
  }
  return {}
}

/**
 * Get Event coordinates relative to the viewport
 */
export function getMouseEventCoordinates(event: MouseEvent): { x: number; y: number } {
  return {
    x: event.clientX,
    y: event.clientY
  }
}

/**
 * Get the event target
 */
export function getEventTarget(event: Event): Element | null {
  // @ts-ignore
  if (typeof event.target === 'undefined') {
    // @ts-ignore
    return (event.srcElement as Element) || null
  } else {
    if ((event.target as Element)?.shadowRoot) {
      return (event.composedPath()[0] as Element) || null
    }
    return (event.target as Element) || null
  }
}

/**
 * Get the value of the event target according to the given attribute
 */
export function getEventTargetValue(event: Event, attribute: string): string | null {
  const target = getEventTarget(event)
  if (!target) {
    return null
  }
  if (attribute === 'text') {
    return getDirectText(target)
  }

  if (attribute === 'className') {
    return getClassName(target)
  }
  if (attribute === 'value') {
    return (target as HTMLInputElement).value
  }
  if (attribute === 'type') {
    return target.getAttribute('type')
  }
  if (attribute === 'tagName') {
    return target.tagName.toLowerCase()
  }
  if (attribute === 'href') {
    return (target as HTMLAnchorElement).href
  }
  if (attribute === 'id') {
    return target.id
  }
  if (attribute === 'name') {
    return target.getAttribute('name')
  }
  if (attribute === 'placeholder') {
    return target.getAttribute('placeholder')
  }
  if (attribute === 'src') {
    return (target as HTMLImageElement).src
  }
  if (attribute === 'title') {
    return target.getAttribute('title')
  }
  if (attribute === 'alt') {
    return target.getAttribute('alt')
  }
  if (attribute === 'role') {
    return target.getAttribute('role')
  }
  if (attribute.startsWith('aria-')) {
    return target.getAttribute(attribute)
  }

  return target.getAttribute(attribute)
}

/**
 * Method to store the event data in the cookies | local storage | memory
 */
export function storeEvent(
  eventData: Record<string, any>,
  callback: (eventData: Record<string, any>) => void
): void {
  let persistence: Persistence = store.get('persistence')
  if (persistence === 'sessionStorage') {
    let existingData = sessionStorage.getItem(STORAGE_KEY)
    if (existingData) {
      let existingDataList: any[] = JSON.parse(existingData)
      existingDataList.push(eventData)
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(existingDataList))
    } else {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify([eventData]))
    }
  }
  if (persistence === 'localStorage') {
    let existingData = localStorage.getItem(STORAGE_KEY)
    if (existingData) {
      let existingDataList: any[] = JSON.parse(existingData)
      existingDataList.push(eventData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingDataList))
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([eventData]))
    }
  }
  if (persistence === 'memory') {
    // store in memory
    if (store.has(STORAGE_KEY)) {
      let existingDataList: any[] = store.get(STORAGE_KEY)
      existingDataList.push(eventData)
      store.set(STORAGE_KEY, existingDataList)
    } else {
      store.set(STORAGE_KEY, [eventData])
    }
  }

  callback(eventData)
}

/**
 * Method to get the event data from the cookies | local storage | memory
 */
export function getStoredEvents(): any[] {
  let persistence: Persistence = store.get('persistence')

  if (persistence === 'sessionStorage') {
    let existingData = sessionStorage.getItem(STORAGE_KEY)
    if (existingData) {
      return JSON.parse(existingData)
    }
  }
  if (persistence === 'localStorage') {
    let existingData = localStorage.getItem(STORAGE_KEY)
    if (existingData) {
      return JSON.parse(existingData)
    }
  }
  if (persistence === 'memory') {
    return store.get(STORAGE_KEY) || []
  }
  return []
}

/**
 * Method to clear the event data from the cookies | local storage | memory
 */
export function clearStoredEvents(): void {
  let persistence: Persistence = store.get('persistence')

  if (persistence === 'sessionStorage') {
    sessionStorage.removeItem(STORAGE_KEY)
  }
  if (persistence === 'localStorage') {
    localStorage.removeItem(STORAGE_KEY)
  }
  if (persistence === 'memory') {
    store.set(STORAGE_KEY, [])
  }
}

/**
 * Method to set the cookie
 */
export function setCookie(keyName: string, value: string | string[]): void {
  document.cookie = `${keyName}=${value}; path=/; SameSite=None; Secure`
}

/**
 * Method to get the cookie, decode and parse it
 */
export function getCookie(keyName: string) {
  function escape(s:string) { return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); }
  const match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(keyName) + '=([^;]*)'));
  return match ? match[1] : null;
}


/**
 * Method to calculate the scroll depth
 */
export function getScrollDepth(): number {
  const doc = document.documentElement
  const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
  const height = doc.scrollHeight - doc.clientHeight
  return Math.round((top / height) * 100)
}

/**
 * Method to check if is mobile device
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Method to check if is bot
 */
export function isBot(): boolean {
  return /bot|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i.test(navigator.userAgent)
}

/**
 * Method to check if is touch device
 */
export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.maxTouchPoints > 0
}

/**
 * Method to get visitor id
 *
 */
export function getVisitorId(): string | null {
  let persistence: Persistence = store.get('persistence')
  let visitorId: string | null = ''
  if (persistence === 'sessionStorage') {
    visitorId = sessionStorage.getItem('visitorId')
    if (!visitorId) {
      visitorId = uuidv4()
      sessionStorage.setItem('visitorId', visitorId)
    }
  } else if (persistence === 'localStorage') {
    visitorId = localStorage.getItem(VISITOR_ID_KEY)
    if (!visitorId) {
      visitorId = uuidv4()
      localStorage.setItem(VISITOR_ID_KEY, visitorId)
    }
  }
  else if (persistence === 'memory') {
    visitorId = store.get(VISITOR_ID_KEY)
    if (!visitorId) {
      visitorId = uuidv4()
      store.set(VISITOR_ID_KEY, visitorId)
    }
  }

  return visitorId
}

export function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    // tslint:disable-next-line:one-variable-per-declaration
    const r = (Math.random() * 16) | 0,
      // tslint:disable-next-line:triple-equals
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}


/**
 * Check whether a DOM event should be "captured" or if it may contain sentitive data
 * using a variety of heuristics.
 * @param elements A list of html tags name to check
 * @param {Event} event - event to check
 * @returns {boolean} whether the event should be captured
 */
export function shouldCaptureDomEvent(elements: string[], event: Event): boolean {
  const target = event.target as HTMLElement
  const tagName = target.tagName.toLowerCase()
  if (elements.indexOf(tagName) === -1) {
    return false
  }

  const type = event.type
  if (type === 'submit') {
    return true
  }

  if (type === 'click' || type === 'mousedown' || type === 'mouseup' || type === 'dblclick' || type === 'contextmenu') {
    return true
  }

  if (type === 'touchstart' || type === 'touchmove' || type === 'touchend') {
    return true
  }

  if (type === 'input' || type === 'change') {
    // const inputType = target.getAttribute('type')
    // if (inputType === 'password' || inputType === 'email') {
    //   return false
    // }
    return true
  }

  return false
}


export {
  RootCapture,
  Store
}
