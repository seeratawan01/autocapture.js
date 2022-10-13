import { Capturable, EventAttributes } from '../types'

export const STORAGE_KEY = 'AUTOCAPTURE_EVENT_DATA'
export const VISITOR_ID_KEY = 'AUTOCAPTURE_VISITOR_ID'

export const DEFAULT_ATTRIBUTES: EventAttributes[] = [
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
  'role'
]

export const DEFAULT_CAPTURE: Capturable[] = ['click', 'change', 'submit']

export const DEFAULT_ELEMENTS = ['a', 'button', 'form', 'input', 'select', 'textarea', 'label']
