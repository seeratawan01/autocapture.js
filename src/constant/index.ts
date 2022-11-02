
import {Attributes, PersistenceType, Capture} from '../types'

// Default values
export const DEFAULT_OPTIONS: {
  ATTRIBUTES: Attributes[],
  CAPTURE: Capture[],
  ELEMENTS: string[],
  PAYLOAD: any,
  PERSISTENCE: PersistenceType,
  SAFELIST: string[],
  STORAGE_KEY: string,
  VISITOR_ID_KEY: string,
  MAX_EVENTS: number,
  MASK_TEXT_CONTENT: boolean,
  PLUGINS: string[],
} = {
  ELEMENTS: ['a', 'button', 'form', 'input', 'select', 'textarea', 'label'],
  ATTRIBUTES: [
    'text',
    'className',
    'value',
    'type',
    'tagName',
    'href',
    'src',
    'id',
    'name',
    'placeholder',
    'title',
    'alt',
    'role',
  ],
  SAFELIST: [],
  CAPTURE: ['tap', 'form', 'page'],
  PAYLOAD: {},
  PERSISTENCE: 'memory',
  STORAGE_KEY: 'AUTOCAPTURE_EVENT_DATA',
  VISITOR_ID_KEY: 'AUTOCAPTURE_VISITOR_ID',
  MAX_EVENTS: 100,
  MASK_TEXT_CONTENT: false,
  PLUGINS: ['scroll', 'mouse-movement']
}
