export type EventHandler = (event: Event) => boolean | void

export type AutoCaptureProps = {
  /**
   * A list of elements to capture events from. Defaults to `document`.
   */
  elements?: Array<HTMLElement | Window | Document>

  /**
   * A list of attributes to capture from the event target. Defaults to `['text', 'className', 'value', 'type']`.
   */
  attributes?: Array<EventAttributes>

  /**
   * A list of selectors to ignore to avoid capturing any sensitive data. Defaults to `[]`.
   */
  safelist?: Array<string>

  /**
   * A boolean to enable or disable debug mode. Defaults to `false`.
   */
  debug?: boolean

  /**
   * A string to set the persistence method. Defaults to `memory`.
   */
  persistence?: 'cookie' | 'localStorage' | 'memory'
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
