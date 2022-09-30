import { EventAttributes } from '../types'

export const STORAGE_KEY = 'EVENT_DATA'
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
