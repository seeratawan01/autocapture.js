import { Attributes, Capture, PersistenceType } from './options'

export type BaseOptions = {
  /**
   * A list of elements to capture events from. Defaults to ['a', 'button', 'form', 'input', 'select', 'textarea', 'label'].
   * @example ['a', 'button', 'form', 'input']
   */
  elements?: string[]

  /**
   * A list of attributes to capture from the event target. Defaults to `['text', 'className', 'value', 'type', 'tagName', 'href', 'src', 'id', 'name', 'placeholder', 'title', 'alt', 'role']`.
   * @example ['tagName', 'className', 'value', 'type']
   */
  attributes?: Array<Attributes>

  /**
   * A list of selectors to ignore to avoid capturing any sensitive data. Defaults to `[]`.
   * @example ['input[type="password"]'] to ignore all password inputs.
   */
  safelist?: Array<string>

  /**
   * A string to set the persistence method. Defaults to `memory`.
   * - `memory`: The events are stored in memory and are lost when the page is refreshed.
   * - `localStorage`: The events are stored in the browser's local storage and are available after the page is refreshed.
   * - `sessionStorage`: The events are stored in the browser's session storage and are available after the page is refreshed.
   * - `none`: The events are not stored anywhere but are available in the callback function.
   */
  persistence?: PersistenceType

  /**
   * A Callback function fires on captured event stored.
   * @param eventData
   * @example
   * ```js
   * onEventCapture: (eventData) => {
   *  console.log(eventData)
   *  // {
   *  //   event: 'click',
   *  //   target: {
   *  //     selector: 'button',
   *  //     attributes: {
   *  //       text: 'Click Me',
   *  //       className: 'btn btn-primary',
   *  //       type: 'button',
   *  //       tagName: 'BUTTON',
   *  //       ...,
   *  //    },
   *  //   }
   *  //   timestamp: 1620920000000,
   *  //   session_id: '123123123',
   *  //   ...,
   *  // }
   *  // ```
   */
  onEventCapture?: (eventData: Record<string, any>) => void

  /**
   * A list of events to capture. Defaults to `['click', 'change', 'submit']`.
   * @example ['click', 'change', 'submit', 'page-view', 'touch', 'scroll']
   */
  capture?: Array<Capture>

  /**
   * Custom session id, you can provide your own visitor id to track the user or use the default one.
   * If you provide your own visitor id, you should make sure it's unique for each user and if you don't
   * provide any visitor id, it will be generated automatically, but it will persist based on the persistence method.
   * @example '123456789'
   */
  sessionId?: string

  /**
   * Custom payload to be sent with each event.
   * @example { 'user_id': '123456789', 'user_name': 'John Doe', 'user_email': ' }
   */
  payload?: Record<string, any>

  /**
   * Specify the maximum number of events to store in the memory, local storage, or session storage and when the limit is reached, the oldest event will be removed.
   */
  maxEvents?: number

  /**
   * Specify if you want to mask the text content of the elements.
   */
  maskTextContent?: boolean
}
