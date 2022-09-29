import { EventAttributes } from '../types'

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
  const textNodes = Array.from(el.childNodes).filter(
    (node) => node.nodeType === Node.TEXT_NODE
  )
  const text = textNodes.map((node) => node.textContent).join('')
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
  attributes.forEach((attribute) => {
    const value = getEventTargetValue(event, attribute)
    if (value) {
      data[attribute] = value
    }
  })
  return data
}

/**
 * Get the event target
 */
export function getEventTarget(event: Event): Element | null {
  if (typeof event.target === 'undefined') {
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
export function getEventTargetValue(
  event: Event,
  attribute: string
): string | null {

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
  return target.getAttribute(attribute)
}
