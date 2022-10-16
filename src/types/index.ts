export type EventHandler = (event: Event) => boolean | void

export type AutoCaptureProps = {
  /**
   * A list of elements to capture events from. Defaults to ['a', 'button', 'form', 'input', 'select', 'textarea', 'label'].
   */
  elements?: string[]

  /**
   * A list of attributes to capture from the event target. Defaults to `['text', 'className', 'value', 'type', 'tagName', 'href', 'src', 'id', 'name', 'placeholder', 'title', 'alt', 'role']`.
   * @example ['tagName', 'className', 'value', 'type']
   */
  attributes?: Array<EventAttributes>

  /**
   * A list of selectors to ignore to avoid capturing any sensitive data. Defaults to `[]`.
   * @example ['input[type="password"]'] to ignore all password inputs.
   */
  safelist?: Array<string>

  /**
   * A string to set the persistence method. Defaults to `memory`.
   * - `memory`: The events are stored in memory and are lost when the page is refreshed.
   * - `localStorage`: The events are stored in the browser's local storage and are available after the page is refreshed.
   * - `cookie`: The events are stored in the browser's cookie and are available after the page is refreshed.
   * - `none`: The events are not stored anywhere but are available in the callback function.
   */
  persistence?: Persistence

  /**
   * A Callback function fires on captured event stored.
   */
  onEventCapture?: (eventData: Record<string, any>) => void

  /**
   * A list of events to capture. Defaults to `['click', 'change', 'submit']`.
   * @example ['click', 'change', 'submit', 'page-view', 'touch', 'scroll']
   */
  capture?: Array<Capturable>
}

export type EventAttributes =
  | 'tagName'
  | 'className'
  | 'text'
  | 'value'
  | 'type'
  | 'href'
  | 'id'
  | 'name'
  | 'placeholder'
  | 'src'
  | 'title'
  | 'alt'
  | 'role'
  | string

export type Capturable = 'scroll' | 'click' | 'double-click' | 'right-click' | 'change' | 'submit' | 'touch' | 'page-view' | 'input' | 'mouse-movement'

export type Persistence = 'memory' | 'localStorage' | 'sessionStorage' | 'none'


