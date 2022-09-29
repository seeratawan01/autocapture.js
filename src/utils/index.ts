import { EventAttributes } from '../types'
import { STORAGE_KEY } from '../constant'

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
 * Get the data from the captured event according to given attributes and structure it for the API
 */
export function getEventData(
  event: Event,
  attributes: Array<EventAttributes>
): Record<string, any> {
  const target = getEventTarget(event)
  const data: Record<string, any> = {}
  if (!target) {
    return data
  }
  attributes.forEach(attribute => {
    const value = getEventTargetValue(event, attribute)
    if (value) {
      data[attribute] = value
    }
  })

  // Add extra data for form events
  if (target instanceof HTMLFormElement) {
    data.form = {
      name: target.name,
      id: target.id,
      method: target.method,
      action: target.action
    }
  }

  // Add extra data for mouse events
  if (event instanceof MouseEvent) {
    data.mouse = getMouseEventCoordinates(event)
  }

  // Add extra data for touch events (only the first touch)
  if (event instanceof Event && event.type.startsWith('touch')) {
    data.touch = getTouchEventCoordinates(event)
  }

  // Add meta data
  data.meta = {
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent
  }
  return data
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
  const target = getEventTarget(event)
  if (!target) {
    return { x: 0, y: 0 }
  }
  const rect = target.getBoundingClientRect()
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
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
    return event.type
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
  persistence: 'cookie' | 'localStorage' | 'memory'
): void {
  const data = JSON.stringify(eventData)
  if (persistence === 'cookie') {
    let existingData = getCookie(STORAGE_KEY)
    if (existingData) {
      let existingDataList: any[] = JSON.parse(existingData)
      existingDataList.push(data)
      setCookie(STORAGE_KEY, JSON.stringify(existingDataList))
    } else {
      setCookie(STORAGE_KEY, JSON.stringify([data]))
    }
  }
  if (persistence === 'localStorage') {
    let existingData = localStorage.getItem(STORAGE_KEY)
    if (existingData) {
      let existingDataList: any[] = JSON.parse(existingData)
      existingDataList.push(data)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingDataList))
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([data]))
    }
  }
  if (persistence === 'memory') {
    if (window.autoCaptureEvents) {
      window.autoCaptureEvents.push(data)
    } else {
      window.autoCaptureEvents = [data]
    }
  }
}

/**
 * Method to get the event data from the cookies | local storage | memory
 */
export function getStoredEvents(persistence: 'cookie' | 'localStorage' | 'memory'): any[] {
  if (persistence === 'cookie') {
    let existingData = getCookie(STORAGE_KEY)
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
    return window.autoCaptureEvents.map((event: string) => JSON.parse(event))
  }
  return []
}

/**
 * Method to clear the event data from the cookies | local storage | memory
 */
export function clearStoredEvents(persistence: 'cookie' | 'localStorage' | 'memory'): void {
  if (persistence === 'cookie') {
    setCookie(STORAGE_KEY, '')
  }
  if (persistence === 'localStorage') {
    localStorage.removeItem(STORAGE_KEY)
  }
  if (persistence === 'memory') {
    window.autoCaptureEvents = []
  }
}

/**
 * Method to set the cookie
 */
export function setCookie(keyName: string, value: string): void {
  document.cookie = `${keyName}=${value}; path=/`
}

/**
 * Method to get the cookie
 */
export function getCookie(keyName: string) {
  const name = keyName + '='
  const decodedCookie = decodeURIComponent(document.cookie)
  const ca = decodedCookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}
