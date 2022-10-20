
import {Attributes, PersistenceType, Capture} from '../types'

// Default values
export const DEFAULT_OPTIONS: {
  ATTRIBUTES: Attributes[],
  CAPTURE: Capture[],
  ELEMENTS: string[],
  PERSISTENCE: PersistenceType,
  SAFELIST: string[],
  STORAGE_KEY: string,
  VISITOR_ID_KEY: string,
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
  CAPTURE: ['click', 'change', 'submit'],
  PERSISTENCE: 'memory',
  STORAGE_KEY: 'AUTOCAPTURE_EVENT_DATA',
  VISITOR_ID_KEY: 'AUTOCAPTURE_VISITOR_ID'
}
