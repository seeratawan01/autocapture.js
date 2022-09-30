export type EventHandler = (event: Event) => boolean | void

export type AutoCaptureProps = {
  /**
   * A list of elements to capture events from. Defaults to ['a', 'button', 'form', 'input', 'select', 'textarea', 'label'].
   */
  elements?: string[]

  /**
   * A list of attributes to capture from the event target. Defaults to `['text', 'className', 'value', 'type']`.
   */
  attributes?: Array<EventAttributes>

  /**
   * A list of selectors to ignore to avoid capturing any sensitive data. Defaults to `[]`.
   */
  safelist?: Array<string>

  /**
   * A string to set the persistence method. Defaults to `memory`.
   */
  persistence?: 'cookie' | 'localStorage' | 'memory'

  /**
   * A Callback function fires on captured event stored.
   */
  onEventStored?: (eventData: Record<string, any>) => void

  /**
   * A list of plugins to use.
   */
  plugins?: Plugins[]
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

export type Plugins = 'scrollMap'
