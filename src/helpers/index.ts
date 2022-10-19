/**
 * This file is used to export all the helper functions that are used in the library to perform some common tasks.
 * The purpose of this file is to keep the code clean and readable.
 * These functions are not exported as part of the library and are only used internally.
 */

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
export function getText(el: Element): string {
  if ((el.textContent as any) instanceof SVGAnimatedString) {
    return (el.textContent as any)?.baseVal || ''
  }
  return el.textContent
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

  const type = event.type

  // Form submit events
  if (type === 'submit' || type === 'input' || type === 'change') {
    return true
  }

  // Mouse events
  if (type === 'click' || type === 'mousedown' || type === 'mouseup' || type === 'dblclick' || type === 'contextmenu') {
    return true
  }

  // touch swipe events
  if (type === 'touchstart' || type === 'touchmove' || type === 'touchend') {
    return true
  }


  return false
}
