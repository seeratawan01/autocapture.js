
import {Attributes, PersistenceType, Capture} from '../types'

// Internal Constants for the library
export const STORAGE_KEY = 'AUTOCAPTURE_EVENT_DATA'
export const VISITOR_ID_KEY = 'AUTOCAPTURE_VISITOR_ID'


// Default values
export const DEFAULT_OPTIONS: {
  ATTRIBUTES: Attributes[],
  CAPTURE: Capture[],
  ELEMENTS: string[],
  PERSISTENCE: PersistenceType,
  SAFELIST: string[],
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
}
