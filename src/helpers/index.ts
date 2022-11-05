/**
 * This file is used to export all the helper functions that are used in the library to perform some common tasks.
 * The purpose of this file is to keep the code clean and readable.
 * These functions are not exported as part of the library and are only used internally.
 */

import { DEFAULT_OPTIONS } from '../constant'
import { Persistence } from '../core'
import { Attributes } from '../types'

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
 * Get the direct text content of an element, accounting for edge cases where element.textContent is an object
 * @param {Element} el - element to get the text of
 * @returns {string} the element's direct text content
 */
export function getText(el: Element, masked: boolean): string {

  let text = ''


  if ((el.textContent as any) instanceof SVGAnimatedString) {
    text = (el.textContent as any)?.baseVal || ''
  }
  text = el.textContent

  if (masked) {
    text = text.replace(/./g, '*')
  }

  return text
}

/**
 * Get the generated unique id (uuidv4)
 * @returns {string} a unique id
 */
export function getUniqueId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Check whether a DOM event should be "captured" or not.
 * @param elements A list of html tags name to check
 * @param {Event} event - event to check
 * @returns {boolean} whether the event should be captured
 */
export function shouldCaptureEvent(elements: string[], event: Event): boolean {
  const target = event.target as HTMLElement
  const tagName = target.tagName.toLowerCase()
  if (elements.indexOf(tagName) === -1) {
    return false
  }

  // const type = event.type
  //
  // // Form submit events
  // if (type === 'submit' || type === 'input' || type === 'change' || type === 'reset') {
  //   return true
  // }
  //
  // // Mouse events
  // if (type === 'click' || type === 'mousedown' || type === 'mouseup' || type === 'dblclick' || type === 'contextmenu') {
  //   return true
  // }
  //
  // // touch swipe events
  // if (type === 'touchstart' || type === 'touchmove' || type === 'touchend') {
  //   return true
  // }


  return true
}

/**
 * Get the event target, accounting for edge cases where event.target is an object
 * @param {Event} event - event to get the target of
 * @returns {Element} the event's target
 */
export function getEventTarget(event: Event): Element | HTMLElement {
  if ((event.target as any) instanceof SVGSVGElement) {
    return (event.target as any)?.correspondingUseElement
  }
  return event.target as Element
}

/**
 * Get the event metadata from user's browser, metadata includes the client specific information
 * @returns {Record<string, any>} the event's metadata
 */
export function getEventMetadata(): Record<string, any> {

  return {
    title: document.title,
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
    language: navigator.language,
    platform: navigator.platform,
    isMobile: isMobileDevice(),
    isTouch: isTouchDevice(),
    isBot: isBot()
  }
}

/**
 * Get the session details from the browser, session details includes the visitor id
 * @param sessionId - provided session id
 * @returns {Record<string, any>} the session details
 */
export function getSessionDetails(sessionId: string): string {
  return sessionId ? sessionId : getSessionId()
}

/**
 * Get the session id from the storage
 */
export function getSessionId(): string {
  // Get Storage instance
  const storage = Persistence.getInstance()

  // if no storage is available means persistence is disabled
  if (!storage) {
    return getUniqueId()
  }

  // Get the session id from the storage
  const visitorId = storage.getItem(DEFAULT_OPTIONS.VISITOR_ID_KEY)

  // If the session id is not present in the storage, generate a new one and store it in the storage
  if (!visitorId) {
    const newVisitorId = getUniqueId()
    storage.setItem(DEFAULT_OPTIONS.VISITOR_ID_KEY, newVisitorId)
    return newVisitorId
  }

  return visitorId
}


/**
 * Get the data from the captured event according to given attributes and structure it for the API
 * @param {Event} event - event to use
 * @param options - options to use
 * @param options.attributes - attributes to use
 * @param options.sessionId - use custom session id if provided
 * @param options.customPayload - attach custom payload if provided
 * @returns {Object} event data
 */
export function prepareEventPayload(event: Event, options: {
  attributes?: Attributes[],
  sessionId?: string,
  payload?: Record<string, any>,
  type?: string
  maskTextContent?: boolean
}): any {

  const { attributes, sessionId, payload, type, maskTextContent } = options

  const target = getEventTarget(event)

  const data: any = {
    event: type || event.type,
    timestamp: new Date().toISOString(),
    meta: getEventMetadata(),
    session: getSessionDetails(sessionId)
  }

  // Add custom payload if provided not empty object
  if (payload && Object.keys(payload).length > 0) {
    data.payload = payload
  }

  if (target.tagName) {
    const selector = target.tagName.toLowerCase()

    data.target = {
      selector,
      attributes: {}
    }

    // Add the target's attributes to the payload
    attributes.forEach((attribute: string) => {
      let value = getAttributeValue(target, attribute, maskTextContent)
      if (value) {
        data.target.attributes[attribute] = value
      }
    })
  }

  return data
}

/**
 * Get the value from given attribute
 * @param {HTMLElement} target - target element
 * @param {string} attribute - attribute name
 * @returns {string} attribute value
 */
export function getAttributeValue(target: HTMLElement | Element, attribute: string, masked: boolean): string {
  switch (attribute) {
    case 'text':
      return getText(target, masked)
    case 'className':
      return getClassName(target)
    case 'value':
      if (masked) {
        return (target as HTMLInputElement).value && (target as HTMLInputElement).value.length > 0 ? '*****' : ''
      }
      return (target as HTMLInputElement).value
    case 'type':
      return (target as HTMLInputElement).type
    case 'tagName':
      return target.tagName.toLowerCase()
    case 'href':
      return (target as HTMLAnchorElement).href
    case 'src':
      return (target as HTMLImageElement).src
    case 'id':
      return target.id
    case 'name':
      return (target as HTMLInputElement).name
    case 'placeholder':
      return (target as HTMLInputElement).placeholder
    case 'title':
      return (target as HTMLElement).title
    case 'alt':
      return (target as HTMLImageElement).alt
    case 'role':
      return target.getAttribute('role')
  }

  // All others attribute
  if (target.hasAttribute(attribute)) {
    return target.getAttribute(attribute)
  }

  return ''
}


/**
 * Method to check if is mobile device
 * @returns {boolean} true if is mobile device
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Method to check if is touch device
 * @returns {boolean} true if is touch device
 */
export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.maxTouchPoints > 0
}

/**
 * Method to check if is bot
 */
export function isBot(): boolean {
  return /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent)
}

/**
 * Method to store the captured payload in the storage
 * @param {Object} payload - payload to store
 * @returns {boolean} true if the payload is stored successfully
 */
export function storePayload(payload: any, storage: Storage, maxLimit = DEFAULT_OPTIONS.MAX_EVENTS): boolean {

  // if no storage is available means persistence is disabled
  if (!storage) {
    return false
  }

  // Get the stored payloads
  let storedPayloads = storage.getItem(DEFAULT_OPTIONS.STORAGE_KEY)
  let storedPayloadsArray = storedPayloads && typeof storedPayloads === 'string' ? JSON.parse(storedPayloads) : []


  // if (typeof storedPayloads === 'string') {
  //   storedPayloads = JSON.parse(storedPayloads) || []
  // }

  // If there are no payloads stored, store the current payload
  if (!storedPayloadsArray) {
    storage.setItem(DEFAULT_OPTIONS.STORAGE_KEY, JSON.stringify([payload]))
    return true
  }

  // If the payloads are more than the max limit, remove the oldest one
  if (storedPayloadsArray.length >= maxLimit) {
    (storedPayloadsArray as unknown as any[]).shift()
  }

  // If there are payloads stored, append the current payload to the stored payloads
  storage.setItem(DEFAULT_OPTIONS.STORAGE_KEY, JSON.stringify([...storedPayloadsArray, payload]))
  return true
}
